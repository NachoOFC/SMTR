import time
import random
import threading
import sys
import json
import os

# Importar librerías de Firebase. Necesitas instalarlas: pip install firebase_admin
try:
    import firebase_admin
    from firebase_admin import credentials
    from firebase_admin import db
except ImportError:
    print("Error: La librería 'firebase_admin' no está instalada.")
    print("Por favor, instala la librería ejecutando: pip install firebase_admin")
    sys.exit(1)


script_dir = os.path.dirname(os.path.abspath(__file__))

#Conexión con FIREBASE
FIREBASE_CONFIG_FILENAME = 'google-services.json' 
FIREBASE_CONFIG_FILE = os.path.join(script_dir, FIREBASE_CONFIG_FILENAME)


SERVICE_ACCOUNT_KEY_FILENAME = 'innovacionproyectos-e79cc-firebase-adminsdk-fbsvc-4b32bfb586.json' 

FIREBASE_CERTIFICATE_PATH = os.path.join(script_dir, SERVICE_ACCOUNT_KEY_FILENAME)


firebase_url = None
project_id = None


# --- Cargar Configuración de Firebase desde google-services.json ---
try:
    print(f"Intentando cargar configuración desde: {FIREBASE_CONFIG_FILE}")
    with open(FIREBASE_CONFIG_FILE, 'r') as f:
        firebase_config = json.load(f)
        # Verificamos la estructura esperada para un archivo google-services.json de cliente
        if 'project_info' in firebase_config and 'firebase_url' in firebase_config['project_info'] and 'project_id' in firebase_config['project_info']:
             firebase_url = firebase_config['project_info']['firebase_url']
             project_id = firebase_config['project_info']['project_id']
             print("Configuración de Firebase cargada exitosamente.")
             print(f" URL de la Base de Datos: {firebase_url}")
             print(f" ID del Proyecto: {project_id}")
        else:
            # Si no tiene la estructura esperada, podría ser el archivo de clave de servicio mal nombrado
            print(f"Error: El archivo {FIREBASE_CONFIG_FILENAME} no parece tener la estructura de un 'google-services.json' de cliente.")
            print("Asegúrate de que 'FIREBASE_CONFIG_FILENAME' apunte al archivo correcto ('google-services (1).json').")
            sys.exit(1)


except FileNotFoundError:
    print(f"Error Crítico: No se encontró el archivo de configuración de Firebase en: {FIREBASE_CONFIG_FILE}")
    print(f"Por favor, asegúrate de que '{FIREBASE_CONFIG_FILENAME}' esté en la misma carpeta que el script.")
    sys.exit(1)
except json.JSONDecodeError:
    print(f"Error: No se pudo decodificar el archivo {FIREBASE_CONFIG_FILE} como JSON. ¿Está corrupto?")
    sys.exit(1)
except Exception as e:
    print(f"Error inesperado al procesar el archivo de configuración {FIREBASE_CONFIG_FILE}: {e}")
    sys.exit(1)

if not firebase_url or not project_id:
     # Esto no debería ocurrir si la carga exitosa, pero es una doble verificación
     print("Error: No se pudo obtener la URL de la base de datos o el ID del proyecto desde el archivo de configuración.")
     sys.exit(1)


# Variable para controlar si la simulación está activa
simulation_running = False

# Evento para señalizar la detención del hilo de simulación
stop_event = threading.Event()


# Funciones para simular diferentes tipos de datos
def simulate_temperature():
    """Simula temperatura en grados Celsius, con posibilidad de valor alto."""
    if random.random() < 0.05: # 5% chance de alta temperatura (anomalia)
        return round(random.uniform(65.0, 80.0), 2)
    else:
        return round(random.uniform(20.0, 55.0), 2)

def simulate_power_consumption():
    """Simula consumo en kWh."""
    if random.random() < 0.03: # 3% chance de alto consumo (anomalia)
        return round(random.uniform(150.0, 300.0), 2)
    else:
        return round(random.uniform(10.0, 120.0), 2)

def simulate_current():
    """Simula corriente en Amperios."""
    if random.random() < 0.04: # 4% chance de una subida de amperaje (anomalia)
        return round(random.uniform(50.0, 100.0), 2)
    else:
        return round(random.uniform(5.0, 45.0), 2)

def simulate_vibration():
    """Simula nivel de vibración (arbitrario)."""
    if random.random() < 0.02: # 2% chance de alta vibracion (anomalia)
        return round(random.uniform(5.0, 10.0), 2)
    else:
        return round(random.uniform(0.1, 4.0), 2)

def simulate_battery_level():
    """Simula nivel de carga de batería en porcentaje."""
    if random.random() < 0.01: # 1% chance de bateria muy baja (critical)
        return round(random.uniform(0.0, 5.0), 1)
    elif random.random() < 0.1: # 10% chance baja de bateria normal
         return round(random.uniform(5.1, 20.0), 1)
    else:
        return round(random.uniform(20.1, 100.0), 1)

#Simula los estados de los componentes, puede estar encendido, peligro o falla
def simulate_component_state():
    """Simula estado (ON/OFF/Warning/Failure)."""
    estados = ["ON", "ON", "ON", "ON", "Warning", "Failure"] 
    return random.choice(estados)

#Esta simulacion no cache para que era XD
def simulate_cycle_count(current_count):
    """Simula un incremento en el contador de ciclos."""
    return current_count + random.randint(1, 5) # Increment by 1-5 cycles

def simulate_humidity():
    """Simula porcentaje de humedad."""
    if random.random() < 0.03: # 3% chance de alta humedad
        return round(random.uniform(80.0, 95.0), 2)
    else:
        return round(random.uniform(30.0, 75.0), 2)

# Mapeo de tipos de parámetro a sus funciones de simulación
PARAMETER_SIMULATORS = {
    "Temperatura (°C)": simulate_temperature,
    "Consumo (kWh)": simulate_power_consumption,
    "Corriente (A)": simulate_current,
    "Vibración": simulate_vibration,
    "Nivel Batería (%)": simulate_battery_level,
    "Estado": simulate_component_state,
    "Humedad (%)": simulate_humidity,
    # 'Ciclos': simulate_cycle_count # Ciclos necesita el valor anterior, se maneja diferente
}

# --- Definición de Tipos de Componentes ---
# Asocia un tipo de activo con los parámetros que monitorea
COMPONENT_TYPES = {
    "Tablero General de Distribución": ["Temperatura (°C)", "Consumo (kWh)", "Humedad (%)"],
    "Banco de Baterías de UPS": ["Nivel Batería (%)", "Estado", "Temperatura (°C)"],
    "Motor de Portón Eléctrico": ["Vibración", "Estado", "Corriente (A)"]
}

# --- Estructura para un Componente Individual ---
class ElectricalComponent:
    def __init__(self, component_id, asset_type, company, sector_location):
        if asset_type not in COMPONENT_TYPES:
            raise ValueError(f"Tipo de activo '{asset_type}' no definido.")

        self.id = component_id
        self.asset_type = asset_type
        self.company = company
        self.sector_location = sector_location
        self.parameters = COMPONENT_TYPES[asset_type]
        self.current_data = {param: None for param in self.parameters}
        # Inicializar el contador de ciclos si aplica (manejo especial)
        self.cycle_count = 0 if 'Ciclos' in self.parameters else None

    def generate_data(self):
        """Genera un nuevo set de datos simulados para este componente."""
        timestamp = int(time.time()) # Timestamp actual
        data = {
            "timestamp": timestamp,
            "asset_type": self.asset_type,
            "company": self.company,
            "sector_location": self.sector_location,
            "values": {}
        }
        for param in self.parameters:
            if param == 'Ciclos': # Manejo especial para ciclos si se incluyera
                 pass # Omitimos Ciclos por ahora a menos que se defina en COMPONENT_TYPES
            elif param in PARAMETER_SIMULATORS:
                data["values"][param] = PARAMETER_SIMULATORS[param]()
            else:
                data["values"][param] = "N/A" # Parámetro no simulable definido o no mapeado

        self.current_data = data
        return data

# --- Lista de Componentes a Simular (5 instancias) ---
components_to_simulate = [
    ElectricalComponent(1, "Tablero General de Distribución", "Industrias ABC S.A.", "Planta Principal - Sector A"),
    ElectricalComponent(2, "Banco de Baterías de UPS", "Comercial X Ltda.", "Edificio Central - Sala Servidores"),
    ElectricalComponent(3, "Motor de Portón Eléctrico", "Residencial Z", "Condominio Los Pinos - Acceso Principal"),
    ElectricalComponent(4, "Tablero General de Distribución", "Empresa XYZ Servicios", "Oficina Matriz - Piso 3"),
    ElectricalComponent(5, "Banco de Baterías de UPS", "Industrias ABC S.A.", "Planta Principal - Sector B - Sala Control"),
]

# --- Función para enviar datos a Firebase ---
def send_to_firebase(component_id, data):
    """Envía los datos de un componente a Firebase Realtime Database."""
    try:
        # La referencia al path donde guardarás los datos.
        # Organizado por componente ID y luego por timestamp.
        ref = db.reference(f'/components/{component_id}/data/{data["timestamp"]}')
        ref.set(data)
        # print(f"[{time.strftime('%H:%M:%S')}] Datos enviados para Componente {component_id}") # Descomenta para ver envíos
    except Exception as e:
        print(f"Error al enviar datos a Firebase para Componente {component_id}: {e}")

# --- Lógica de Simulación ---
def run_simulation():
    """Corre la simulación, generando y enviando datos periódicamente."""
    print("Iniciando simulación... Presiona Enter para detener.")
    global simulation_running
    simulation_running = True

    while simulation_running and not stop_event.is_set():
        print(f"[{time.strftime('%H:%M:%S')}] Generando y enviando datos...")
        for component in components_to_simulate:
            simulated_data = component.generate_data()
            # print(f"Generado para Cmp {component.id}: {simulated_data}") # Opcional: imprimir datos generados
            send_to_firebase(component.id, simulated_data)

        # Esperar el intervalo de 2 segundos, pero permitiendo la detención
        stop_event.wait(2) # Espera 2 segundos o hasta que stop_event sea activado

    print("Simulación detenida.")

# --- Función principal para la interfaz de consola ---
def main():
    print("--- Simulador de Componentes Eléctricos ---")

    # --- Verificación y Inicialización de Firebase ---
    # 1. Verificar si el archivo de la clave de servicio existe
    if not os.path.exists(FIREBASE_CERTIFICATE_PATH):
         print(f"\nError Crítico: No se encontró el archivo de credenciales de la Cuenta de Servicio en la ruta esperada:")
         print(f"-> {FIREBASE_CERTIFICATE_PATH}")
         print("\nPor favor, asegúrate de:")
         print("1. Haber descargado la clave privada de la Cuenta de Servicio desde la consola de Firebase.")
         print("2. Haber guardado el archivo JSON descargado en la MISMA CARPETA que este script.")
         print("3. Haber actualizado la variable 'SERVICE_ACCOUNT_KEY_FILENAME' en el código con el NOMBRE EXACTO de ese archivo JSON.")
         sys.exit(1)

    # 2. Inicializar Firebase usando las credenciales de la Cuenta de Servicio y la URL de la DB
    try:
        # Intenta inicializar Firebase solo si no ha sido inicializado antes
        if not firebase_admin._apps:
            print(f"Intentando inicializar Firebase con credenciales de cuenta de servicio desde: {FIREBASE_CERTIFICATE_PATH}")
            cred = credentials.Certificate(FIREBASE_CERTIFICATE_PATH)
            firebase_admin.initialize_app(cred, {
                'databaseURL': firebase_url # Usamos la URL obtenida del archivo JSON de configuración
            })
            print("Firebase inicializado correctamente usando credenciales de cuenta de servicio.")
    except Exception as e:
        print(f"\nError al inicializar Firebase con la clave de cuenta de servicio: {e}")
        print("Verifica que el archivo en la ruta especificada sea un archivo JSON de clave de cuenta de servicio válido y sin corromper.")
        print("Asegúrate también de que la URL de la base de datos ('databaseURL') sea correcta en la inicialización.")
        sys.exit(1) # Salir si falla la inicialización de Firebase


    while True:
        user_input = input("¿Iniciar simulación? (si/no): ").strip().lower()

        if user_input == 'si':
            if simulation_running:
                print("La simulación ya está en curso.")
                continue
            stop_event.clear() # Reiniciar el evento por si acaso
            # Inicia la simulación en un hilo separado para no bloquear la entrada de consola
            simulation_thread = threading.Thread(target=run_simulation)
            simulation_thread.start()

            # Espera a que el usuario presione Enter para detener
            input() # Esto bloqueará hasta que se presione Enter
            stop_event.set() # Señaliza al hilo de simulación que se detenga
            simulation_thread.join() # Espera a que el hilo termine

            print("Simulación detenida por el usuario.")


        elif user_input == 'no':
            if simulation_running:
                print("Deteniendo simulación antes de salir...")
                stop_event.set()
                time.sleep(2.1) # Dar un pequeño tiempo para que el hilo termine
            print("Saliendo del simulador.")
            break
        else:
            print("Entrada no válida. Por favor, responde 'si' o 'no'.")


if __name__ == "__main__":
    main()