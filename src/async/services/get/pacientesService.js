import { get } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const PAGE_SIZE = 100; // máximo permitido por la API

// La API pagina (20 por defecto, máx. 100). Se recorren todas las páginas
// para devolver la lista completa de pacientes.
const pacientesService = async () => {
  const base = `${buildApiUri()}/v1/patients`;
  const first = await get(`${base}?page=1&limit=${PAGE_SIZE}`, undefined, "velasco");

  const total = first?.meta?.total ?? first?.data?.length ?? 0;
  const pages = Math.ceil(total / PAGE_SIZE);

  if (pages <= 1) return first;

  const rest = await Promise.all(
    Array.from({ length: pages - 1 }, (_, i) =>
      get(`${base}?page=${i + 2}&limit=${PAGE_SIZE}`, undefined, "velasco")
    )
  );

  return {
    ...first,
    data: [first.data, ...rest.map((r) => r.data)].flat(),
  };
};
export default pacientesService;
