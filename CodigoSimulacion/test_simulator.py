import unittest

# Importamos las funciones y clases a probar
#python -m unittest discover -v -s CodigoSimulacion -p "test_*.py"
#para simular
from SimuladorDatos import (
    simulate_temperature,
    simulate_power_consumption,
    simulate_current,
    simulate_vibration,
    simulate_battery_level,
    simulate_component_state,
    simulate_humidity,
    ElectricalComponent
)

class TestSimulador(unittest.TestCase):
    def test_simulate_temperature_ranges(self):
        temps = [simulate_temperature() for _ in range(1000)]
        # Debe ser float y estar entre 20.0 y 80.0
        self.assertTrue(all(isinstance(t, float) for t in temps))
        self.assertTrue(all(20.0 <= t <= 80.0 for t in temps))

    def test_simulate_power_consumption_non_negative(self):
        valores = [simulate_power_consumption() for _ in range(200)]
        self.assertTrue(all(v >= 0 for v in valores))

    def test_simulate_current_non_negative(self):
        valores = [simulate_current() for _ in range(200)]
        self.assertTrue(all(v >= 0 for v in valores))

    def test_simulate_vibration_range(self):
        vals = [simulate_vibration() for _ in range(200)]
        self.assertTrue(all(isinstance(v, float) for v in vals))
        self.assertTrue(all(0.1 <= v <= 10.0 for v in vals))

    def test_simulate_battery_level_range(self):
        levels = [simulate_battery_level() for _ in range(200)]
        self.assertTrue(all(isinstance(l, float) for l in levels))
        self.assertTrue(all(0.0 <= l <= 100.0 for l in levels))

    def test_simulate_component_state_valid(self):
        estados = set(simulate_component_state() for _ in range(200))
        posibles = {"ON", "Warning", "Failure"}
        self.assertTrue(estados.issubset(posibles))

    def test_simulate_humidity_range(self):
        hs = [simulate_humidity() for _ in range(200)]
        self.assertTrue(all(30.0 <= h <= 95.0 for h in hs))

    def test_electrical_component_generate_data_structure(self):
        comp = ElectricalComponent(99, "Tablero General de Distribución", "Comp S.A.", "Sector X")
        data = comp.generate_data()
        # Claves top-level
        self.assertIn("timestamp", data)
        self.assertIn("asset_type", data)
        self.assertIn("company", data)
        self.assertIn("sector_location", data)
        self.assertIn("values", data)
        # Los parámetros deben estar en los valores
        for param in comp.parameters:
            self.assertIn(param, data["values"])

if __name__ == "__main__":
    unittest.main()
