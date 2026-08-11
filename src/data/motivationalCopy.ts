export type MotivationalDay = 3 | 2 | 1;

export const MOTIVATIONAL_COPY: Record<MotivationalDay, string> = {
  3: "A brisa do mar já bate no rosto e a energia de Jurerê Internacional chama pelo nosso nome. Não é só um CEP novo, é o nosso novo padrão de vida, rodeado pelo que há de melhor. A Ilha da Magia não perdoa quem sonha pequeno, e nós estamos chegando para fazer história. Faltam só três dias para pisar no lugar que a gente escolheu dominar. Coloca a garra na mesa, mantém o foco e vamos buscar o que é nosso por direito! 🐿️",
  2: "Esquece o plano B. O sol de Floripa já está esquentando o nosso futuro e as ruas de Jurerê estão prontas para conhecer o nosso ritmo. Cada noite de trabalho, cada suor e cada renúncia nos trouxeram até a beira dessa nova realidade. A energia dessa ilha é surreal, vibrante e abundante. Falta quase nada. Faça nos dentes, porque a gente não vai só tentar, a gente vai conseguir essa pohha! 🐿️",
  1: "É AMANHÃ! O relógio está quase zerando e a mala já está pesada de propósito e visão. Jurerê Internacional deixou de ser um projeto na tela para se tornar o nosso quintal oficial. Floripa inteira está esperando por nós. Nós tivemos a garra inabalável para chegar até aqui e agora absolutamente ninguém segura esse voo. Respira fundo, sente o gosto da vitória e prepara o espírito. A Ilha é nossa. Let's go, pohha! 🐿️",
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
