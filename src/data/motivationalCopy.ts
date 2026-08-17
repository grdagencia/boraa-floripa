export type MotivationalDay = 3 | 2 | 1;

/** Copy BH com <strong> nas palavras-chave (hero). */
export const BH_IMPACT_COPY =
  'Boraa CUIUDOS, nós somos maiores que isso e sempre fomos. Não vamos nos abalar por besteiras e probleminhas nunca, pohha! As noites de sono perdidas, os energéticos tomados, as insônias tomando conta, os cansaços na coluna, nos olhos, na cabeça, não são em vão, é o acelerador que nós apertamos e não tiramos o pé. <strong>BORAAA pra cima, PRA TRÁS NEM PRA PEGAR IMPULSO.</strong> Lembrando: BH é só uma encostada lá, lugar de fazer a grana e voltar a ter nossa liberdade. Porque o nosso lugar é <strong>Santa Catarina</strong>. Bora, nós merecemos isso. Não somos <strong>FRACOS</strong>, não somos <strong>MACIO</strong>. 🐿️';

/** HTML com <strong> nas palavras-chave (renderizado no hero nos últimos dias). */
export const MOTIVATIONAL_COPY: Record<MotivationalDay, string> = {
  3: BH_IMPACT_COPY,
  2: BH_IMPACT_COPY,
  1: BH_IMPACT_COPY,
};

/** Retorna 3, 2 ou 1 enquanto faltam 3 dias ou menos; null acima disso ou após o fim. */
export function getMotivationalDay(
  daysLeft: number | null,
  finished: boolean,
): MotivationalDay | null {
  if (daysLeft === null || finished) return null;
  if (daysLeft > 3) return null;
  if (daysLeft === 3) return 3;
  if (daysLeft === 2) return 2;
  return 1;
}
