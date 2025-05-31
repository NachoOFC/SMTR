import { getDatabase, ref, onValue } from "firebase/database";

export const useAssets = () => {
  const fetchAssets = (callback) => {
    const db = getDatabase();
    const assetsRef = ref(db, "components");

    onValue(
      assetsRef,
      (snapshot) => {
        const data = snapshot.val();
        const loadedAssets = [];

        if (data) {
          for (const componentId in data) {
            const componentData = data[componentId];

            if (componentData && componentData.data) {
              const timestampEntries = componentData.data;
              const timestamps = Object.keys(timestampEntries).sort();
              const latestTimestamp = timestamps[timestamps.length - 1];
              const latestAssetData = timestampEntries[latestTimestamp];

              let displayValue = "N/A";
              let assetStatus = "Desconocido";
              let assetType = "general";
              let valueClass = "badge-secondary";

              if (latestAssetData.values) {
                const valuesKeys = Object.keys(latestAssetData.values);
                if (valuesKeys.length > 0) {
                  const firstValueKey = valuesKeys[0];
                  const firstValue = latestAssetData.values[firstValueKey];

                  const unitMatch = firstValueKey.match(/\((.*)\)/);
                  const unit = unitMatch ? unitMatch[1] : "";
                  displayValue = `${firstValue}${unit ? " " + unit : ""}`.trim();

                  const lowerCaseKey = firstValueKey.toLowerCase();
                  const lowerCaseAssetType = latestAssetData.asset_type
                    ? latestAssetData.asset_type.toLowerCase()
                    : "";

                  if (
                    lowerCaseKey.includes("temperatura") ||
                    lowerCaseKey.includes("°c") ||
                    lowerCaseAssetType.includes("temperatura")
                  ) {
                    assetType = "temp";
                    if (parseFloat(firstValue) > 40) {
                      valueClass = "bg-danger";
                      assetStatus = "Crítico";
                    } else if (parseFloat(firstValue) > 30) {
                      valueClass = "bg-warning text-dark";
                      assetStatus = "Precaución";
                    } else {
                      valueClass = "bg-success";
                      assetStatus = "Bueno";
                    }
                  } else if (
                    lowerCaseKey.includes("consumo") ||
                    lowerCaseKey.includes("kwh") ||
                    lowerCaseAssetType.includes("electric") ||
                    lowerCaseAssetType.includes("eléctric")
                  ) {
                    assetType = "electric";
                    if (parseFloat(firstValue) > 100) {
                      valueClass = "bg-danger";
                      assetStatus = "Crítico";
                    } else if (parseFloat(firstValue) > 70){
                      valueClass = "bg-warning text-dark";
                      assetStatus = "Precaución";
                    
                    } else {
                      valueClass = "bg-success";
                      assetStatus = "Bueno";
                    }
                  } else if (
                    lowerCaseKey.includes("vibracion") ||
                    lowerCaseKey.includes("g") ||
                    lowerCaseAssetType.includes("vibracion")
                  ) {
                    assetType = "vib";
                    if (parseFloat(firstValue) > 5) {
                      valueClass = "bg-danger";
                      assetStatus = "Crítico";
                    } else if (parseFloat(firstValue) > 2) {
                      valueClass = "bg-warning text-dark";
                      assetStatus = "Precaución";
                    } else {
                      valueClass = "bg-success";
                      assetStatus = "Bueno";
                    }
                  } else {
                    if (
                      firstValue !== null &&
                      firstValue !== undefined &&
                      firstValue !== ""
                    ) {
                      valueClass = "bg-success";
                      assetStatus = "Bueno";
                    } else {
                      valueClass = "badge-secondary";
                      assetStatus = "Desconocido";
                    }
                  }
                }
              }

              loadedAssets.push({
                id: componentId,
                name: latestAssetData.asset_type || "Sin Nombre",
                value: displayValue,
                valueClass: valueClass,
                sector: latestAssetData.sector_location || "Sin Sector",
                status: assetStatus,
                type: assetType,
              });
            }
          }
        }

        callback(loadedAssets);
      },
      (error) => {
        console.error("Error al cargar datos de Firebase:", error);
      }
    );
  };

  return {
    fetchAssets,
  };
}; 