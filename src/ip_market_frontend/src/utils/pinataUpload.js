// utils/pinataUpload.js
const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;
const PINATA_GATEWAY = import.meta.env.VITE_PINATA_GATEWAY;

export const uploadToPinata = async (file) => {
  if (!PINATA_JWT) {
    throw new Error("Pinata JWT not configured");
  }

  const formData = new FormData();
  formData.append("file", file);

  const metadata = JSON.stringify({
    name: file.name,
    keyvalues: {
      project: "ip_marketplace",
      type: "nft_image",
    },
  });
  formData.append("pinataMetadata", metadata);

  const options = JSON.stringify({
    cidVersion: 0,
  });
  formData.append("pinataOptions", options);

  try {
    const response = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PINATA_JWT}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Return the full URL using the gateway
    return {
      ipfsHash: result.IpfsHash,
      url: `${PINATA_GATEWAY}ipfs/${result.IpfsHash}`,
      success: true,
    };
  } catch (error) {
    console.error("Error uploading to Pinata:", error);
    throw error;
  }
};

export const uploadMetadataToPinata = async (metadata) => {
  if (!PINATA_JWT) {
    throw new Error("Pinata JWT not configured");
  }

  try {
    const response = await fetch(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${PINATA_JWT}`,
        },
        body: JSON.stringify({
          pinataContent: metadata,
          pinataMetadata: {
            name: `${metadata.name}_metadata`,
            keyvalues: {
              project: "ip_marketplace",
              type: "nft_metadata",
            },
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    return {
      ipfsHash: result.IpfsHash,
      url: `${PINATA_GATEWAY}ipfs/${result.IpfsHash}`,
      success: true,
    };
  } catch (error) {
    console.error("Error uploading metadata to Pinata:", error);
    throw error;
  }
};
