const API_BASE_URL = "/api";

export async function fetchPatientImageEmrList(sChtNum: string): Promise<unknown> {
  const encodedChtNum = encodeURIComponent(sChtNum).replace(/%20/g, "%20");
  const url = `${API_BASE_URL}/v1/EMR/EMRPatInfo?sChtNum=${encodedChtNum}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Request failed: ${response.status} ${response.statusText} - ${errorText}`);
  }

  return response.json();
}
