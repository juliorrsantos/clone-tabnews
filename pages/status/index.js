import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();

  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
      <DatabaseVersion />
      <MaxConnections />
      <OpenConnections />
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let updatedAtText = "Carregando...";

  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  }

  return <div>Última atualização: {updatedAtText}</div>;
}

function DatabaseVersion() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let databaseVersionText = "Carregando...";

  if (!isLoading && data) {
    databaseVersionText = data.dependencies.database.version;
  }

  return <div>Versão do BD: {databaseVersionText}</div>;
}

function MaxConnections() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let maxConnectionsText = "Carregando...";

  if (!isLoading && data) {
    maxConnectionsText = data.dependencies.database.max_connections;
  }

  return <div>Número máximo de conexões: {maxConnectionsText}</div>;
}

function OpenConnections() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let openConnectionsText = "Carregando...";

  if (!isLoading && data) {
    openConnectionsText = data.dependencies.database.opened_connections;
  }

  return <div>Conexões abertas: {openConnectionsText}</div>;
}
