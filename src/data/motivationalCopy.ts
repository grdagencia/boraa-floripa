export type MotivationalDay = 3 | 2 | 1;

/** HTML com <strong> nas palavras-chave (renderizado no hero). */
export const MOTIVATIONAL_COPY: Record<MotivationalDay, string> = {
  3: "A brisa do mar já bate no rosto e a energia de <strong>Jurerê Internacional</strong> chama pelo nosso nome. Não é só um CEP novo, é o <strong>nosso novo padrão de vida</strong>, rodeado pelo que há de melhor. A Ilha da Magia não perdoa quem sonha pequeno, e nós estamos chegando para <strong>fazer história</strong>. Faltam só três dias para pisar no lugar que a gente escolheu dominar. Coloca a garra na mesa, mantém o foco e <strong>vamos buscar o que é nosso por direito!</strong> 🐿️",
  2: "<strong>Esquece o plano B.</strong> O sol de Floripa já está esquentando o nosso futuro e as ruas de Jurerê estão prontas para conhecer o nosso ritmo. Cada noite de trabalho, cada suor e cada renúncia nos trouxeram até a beira dessa <strong>nova realidade</strong>. A energia dessa ilha é surreal, vibrante e abundante. <strong>Falta quase nada.</strong> Faca nos dentes, porque a gente não vai só tentar, <strong>a gente vai conseguir essa pohha!</strong> 🐿️",
  1: "<strong>É AMANHÃ!</strong> O relógio está quase zerando e a mala já está pesada de propósito e visão. <strong>Jurerê Internacional</strong> deixou de ser um projeto na tela para se tornar o nosso quintal oficial. Floripa inteira está esperando por nós. Nós tivemos a <strong>garra inabalável</strong> para chegar até aqui e agora absolutamente ninguém segura esse voo. Respira fundo, sente o gosto da vitória e prepara o espírito. <strong>A Ilha é nossa. Let's go, pohha!</strong> 🐿️",
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
