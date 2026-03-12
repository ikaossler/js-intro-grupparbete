
// data från rooms.json, varje rum har en id, namn och beskrivning.
type RoomJsonItem = {
  id: string;
  name: string;
  description: string;
};
// vilka dom-element som behövs för att visa intro och starta spelet.
type RoomIntroConfig = {
  roomId: string;
  introId: string;
  titleId: string;
  descriptionId: string;
  startButtonId: string;
  contentId: string;
  onStart?: () => void;
};

// Samma knapptext i alla intro-rutor.
const INTRO_BUTTON_TEXT = "Start";

// Enkel cache så vi inte hämtar rooms.json flera gånger.
let roomsCache: RoomJsonItem[] | null = null;

// Hämtar rum-data från json en gång.
async function getRoomsData(): Promise<RoomJsonItem[]> {
  if (roomsCache) {
    return roomsCache;
  }
  //
  const response = await fetch(`${import.meta.env.BASE_URL}rooms.json`);
  const rooms = (await response.json()) as RoomJsonItem[];
  roomsCache = rooms;
  return rooms;
}

// Hjälpfunktion som hämtar html element och returnerar null om något saknas.
function getElementById<T extends HTMLElement>(elementId: string): T | null {
  return document.getElementById(elementId) as T | null;
}

// Skapar samma rubrikformat i alla rum, t.ex. "Room 2: Captcha Challenge".
function formatRoomTitle(roomId: string, roomName: string): string {
  const roomNumber = roomId.replace("room", "");
  return `Room ${roomNumber}: ${roomName}`;
}

// Sätter upp introflöde för ett rum:
// 1) visa namn + beskrivning från json
// 2) visa intro först
// 3) startknapp visar spelets innehåll
export async function setupRoomIntro(config: RoomIntroConfig): Promise<void> {
  const intro = getElementById<HTMLElement>(config.introId);
  const title = getElementById<HTMLElement>(config.titleId);
  const description = getElementById<HTMLElement>(config.descriptionId);
  const startButton = getElementById<HTMLButtonElement>(config.startButtonId);
  const content = getElementById<HTMLElement>(config.contentId);

  // Guard: om något saknas ska vi inte krascha.
  if (!intro || !title || !description || !startButton || !content) {
    return;
  }
  // Alias efter guard så TypeScript vet att de inte är null.
  const introElement = intro;
  const titleElement = title;
  const descriptionElement = description;
  const startButtonElement = startButton;
  const contentElement = content;

  const rooms = await getRoomsData();
  const roomData = rooms.find((room) => room.id === config.roomId);
  if (!roomData) {
    return;
  }

  // Samma titel-format i alla rum.
  titleElement.textContent = formatRoomTitle(config.roomId, roomData.name);
  descriptionElement.textContent = roomData.description;
  // Samma knapptext i alla rum för konsekvent layout.
  startButtonElement.textContent = INTRO_BUTTON_TEXT;

  // Visa intro först. Själva spelet göms tills startknappen klickas.
  introElement.hidden = false;
  contentElement.hidden = true;

  // Namngiven handler för tydlighet och enklare felsökning.
  function handleIntroStartClick(): void {
    introElement.hidden = true;
    contentElement.hidden = false;

    if (config.onStart) {
      config.onStart();
    }
  }

  // once: true gör att klicket bara kopplas en gång.
  startButtonElement.addEventListener("click", handleIntroStartClick, { once: true });
}
