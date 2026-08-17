export const TRIP = {
  // EDITE AQUI a data/hora alvo (fuso America/Sao_Paulo).
  targetDate: "2026-08-19T00:00:00-03:00",
  timeZone: "America/Sao_Paulo",
  displayDate: "19 de agosto de 2026",
  displayTime: "00:00",
  // EDITE AQUI a imagem do cartão / bilhete (arquivo em public/images/).
  ticketImage: "/images/cartao.png",
};

export const UI = {
  // EDITE AQUI a imagem da notificação de venda.
  notificationImage: "/images/notifi.svg",
  // Tempo visível da notificação (ms). Aparece só na primeira visita.
  notificationVisibleMs: 4200,
  notificationFirstDelayMs: 2800,
  // Quantidade de missões por página no checklist.
  missionsPerPage: 6,
  // Splash tipográfico inicial (ms visível antes do fade-out).
  introDurationMs: 2700,
  // Imagem de fundo do hero (Modo Caverna).
  heroImage:
    "/images/wolf-of-wall-street-leonardo-dicaprio1-375fc9b29eb84a939f9a4ce34470d414.jpg",
  // GIF da seção final.
  finalGif: "/images/spector.gif",
  // Vídeos obrigatórios do modo caverna.
  caveVideos: [
    "/videos/C1.mp4",
    "/videos/C2.mp4",
    "/videos/C3.mp4",
    "/videos/C4.mp4",
    "/videos/C5.mp4",
    "/videos/C6.mp4",
  ],
  // Velocidade do vídeo (1 = normal, 0.5 = metade da velocidade).
  heroVideoPlaybackRate: 0.55,
  // Fade entre um vídeo e o próximo (ms).
  heroVideoCrossfadeMs: 900,
  // Timer fica vermelho quando faltam este número de dias ou menos.
  urgentDaysThreshold: 3,
  // Vídeos da seção Chile (após CUIUDO). Coloque os arquivos em public/videos/.
  chileVideos: ["/videos/chile1.mp4", "/videos/chile2.mp4", "/videos/chile3.mp4"],
  // Alternância título ↔ copy motivacional (ms).
  heroTitleRotateMs: 60_000,
};

/** Meta do iPhone 15 Pro Max. */
export const GOAL = {
  name: "iPhone 15 Pro Max",
  targetDate: "2026-08-26T00:00:00-03:00",
  displayDate: "Dia 26 de Agosto",
  storageKey: "floripa-iphone-goal-v1",
};

export type AirbnbOption = {
  id: number;
  name: string;
  neighborhood: string;
  price: string;
  image: string;
  url: string;
  preferred?: boolean;
};

export type Mission = {
  id: string;
  label: string;
};

// EDITE AQUI imagens, bairros, valores e links dos Airbnbs.
// Fotos em public/images/1.avif ... 11.avif
export const AIRBNB_OPTIONS: AirbnbOption[] = [
  {
    id: 1,
    name: "Florianópolis",
    neighborhood: "Jurerê",
    price: "R$ 3.584,51",
    image: "/images/1.avif",
    url: "https://www.airbnb.com.br/rooms/46849456?adults=2&check_in=2026-08-15&check_out=2026-09-15&search_mode=regular_search&source_impression_id=p3_1785950311_P3_a0qLSJsBVrgwa&previous_page_section_name=1000&federated_search_id=99511c36-6956-452d-aa87-22431aa5d34e",
    preferred: true,
  },
  {
    id: 2,
    name: "Itapema",
    neighborhood: "Castelo Branco",
    price: "R$ 3.732,47",
    image: "/images/2.avif",
    url: "https://www.airbnb.com.br/rooms/22428287?adults=2&check_in=2026-08-15&check_out=2026-09-15&pets=1&search_mode=regular_search&source_impression_id=p3_1785983442_P3KEGdYXXDGLgpMZ&previous_page_section_name=1000&federated_search_id=2690a317-09e7-4621-9927-933b9cee2ab1",
  },
  {
    id: 3,
    name: "Bombinhas",
    neighborhood: "Praia de Bombas",
    price: "R$ 3.587,43",
    image: "/images/3.avif",
    url: "https://www.airbnb.com.br/rooms/1443461612726915603?adults=2&check_in=2026-08-15&check_out=2026-09-15&pets=1&search_mode=regular_search&source_impression_id=p3_1785983442_P33QBZsPnkejTpzE&previous_page_section_name=1000&federated_search_id=2690a317-09e7-4621-9927-933b9cee2ab1",
  },
  {
    id: 4,
    name: "Bombinhas",
    neighborhood: "Praia de Bombas",
    price: "R$ 3.587,43",
    image: "/images/4.avif",
    url: "https://www.airbnb.com.br/rooms/1443462410027194149?adults=2&check_in=2026-08-15&check_out=2026-09-15&pets=1&search_mode=regular_search&source_impression_id=p3_1785983611_P3qWIakIb58II-tn&previous_page_section_name=1000&federated_search_id=495666db-35da-4c19-875e-e01e70597a1b",
  },
  {
    id: 5,
    name: "Palhoça",
    neighborhood: "Pé na Areia",
    price: "R$ 3.576,82",
    image: "/images/5.avif",
    url: "https://www.airbnb.com.br/rooms/22313430?adults=2&check_in=2026-08-15&check_out=2026-09-15&pets=1&search_mode=regular_search&source_impression_id=p3_1785983818_P3b-32iCsvoiv7eF&previous_page_section_name=1000&federated_search_id=5decee64-2b39-4d7f-a041-a87f1c7d1fc3",
  },
  {
    id: 6,
    name: "Itapema",
    neighborhood: "Morretes",
    price: "R$ 4.548,49",
    image: "/images/6.avif",
    url: "https://www.airbnb.com.br/rooms/1560162023487928807?adults=2&check_in=2026-08-15&check_out=2026-09-15&pets=1&search_mode=regular_search&source_impression_id=p3_1785982550_P3VG1VbROnae6-k6&previous_page_section_name=1000&federated_search_id=2f167d83-b238-41da-8c02-e3f8d60f3c5c",
  },
  {
    id: 7,
    name: "Balneário Camboriú",
    neighborhood: "1min da areia",
    price: "R$ 4.460,69",
    image: "/images/7.avif",
    url: "https://www.airbnb.com.br/rooms/1516137054224100569?adults=2&check_in=2026-08-15&check_out=2026-09-15&pets=1&search_mode=regular_search&source_impression_id=p3_1785982755_P34K22_bccWhO77k&previous_page_section_name=1000&federated_search_id=e5282eb1-8088-480f-a38a-12d8781b4160",
  },
  {
    id: 8,
    name: "Itapema",
    neighborhood: "600m da Praia",
    price: "R$ 4.691,34",
    image: "/images/8.avif",
    url: "https://www.airbnb.com.br/rooms/1457995087498329060?adults=2&check_in=2026-08-15&check_out=2026-09-15&search_mode=regular_search&source_impression_id=p3_1785982035_P3Tp3M-ZhsTI6v-Z&previous_page_section_name=1000&federated_search_id=8ea864c1-d0b8-48d2-88f0-00d15eb3f5cc",
  },
  {
    id: 9,
    name: "Itapema",
    neighborhood: "Meia Praia",
    price: "R$ 4.369,12",
    image: "/images/9.avif",
    url: "https://www.airbnb.com.br/rooms/1312945995548248214?adults=2&check_in=2026-08-15&check_out=2026-09-15&pets=1&search_mode=regular_search&source_impression_id=p3_1785982182_P34e0DZHq443m7-T&previous_page_section_name=1000&federated_search_id=276b4e3d-2111-4f67-819d-160aaa7d17ca",
  },
  {
    id: 10,
    name: "Florianópolis",
    neighborhood: "Ingleses",
    price: "R$ 4.083,96",
    image: "/images/10.avif",
    url: "https://www.airbnb.com.br/rooms/1602998465136602622?adults=2&check_in=2026-08-15&check_out=2026-09-15&search_mode=regular_search&source_impression_id=p3_1785978841_P3NVO_fJZiMidvH2&previous_page_section_name=1000&federated_search_id=fcadbbbc-e7e9-4224-998f-0a627c731303",
  },
  {
    id: 11,
    name: "Florianópolis",
    neighborhood: "Canasvieiras",
    price: "R$ 3.808,17",
    image: "/images/11.avif",
    url: "https://www.airbnb.com.br/rooms/16601811?adults=2&check_in=2026-08-15&check_out=2026-09-15&location=Balne%C3%A1rio%20Cambori%C3%BA%2C%20SC&pets=1&search_mode=regular_search&source_impression_id=p3_1785983322_P3Ba40vBz-XhjraX&previous_page_section_name=1001&federated_search_id=bf19227f-288a-4c83-a94f-b4acbf3d477b",
  },
];

// EDITE AQUI para adicionar, remover ou renomear missões.
// Cada missão precisa de um id único e estável.
export const INITIAL_MISSIONS: Mission[] = [
  { id: "liberdade", label: "LIBERDADE." },
];
