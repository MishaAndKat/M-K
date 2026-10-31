// Отдельное «пространство имён» этого сайта в Firestore.
//
// Старый сайт (с Nicol) хранит данные в коллекциях watchRoom / watchRoomChat /
// watchRoomPresence. Этот сайт пишет в СОВСЕМ ДРУГИЕ коллекции, поэтому:
//   - чат здесь начинается пустым;
//   - старый чат и старый плейлист остаются нетронутыми и продолжают работать;
//   - воспроизведение двух сайтов не пересекается (разные «комнаты»).
//
// Если когда-нибудь понадобится ещё один независимый чат — достаточно сменить
// NEXT_PUBLIC_ROOM_NAMESPACE (или значение по умолчанию ниже).
const raw = (process.env.NEXT_PUBLIC_ROOM_NAMESPACE || "nightPlay").replace(/[^A-Za-z0-9_]/g, "");
export const ROOM_NS = raw || "nightPlay";

export const ROOM_COLLECTION = `${ROOM_NS}Room`; // документ «room» с плейлистом и состоянием плеера
export const CHAT_COLLECTION = `${ROOM_NS}Chat`; // сообщения чата
export const PRESENCE_COLLECTION = `${ROOM_NS}Presence`; // «в сети / не в сети»

// Ключи localStorage. GitHub Pages отдаёт все репозитории с одного домена
// (username.github.io), поэтому у этого сайта свои ключи, чтобы они не
// пересекались с ключами старого сайта.
export const WHOAMI_KEY = "nightplay-whoami";
export const LAST_READ_KEY_PREFIX = "nightplay-chat-lastread-";
export const PROGRESS_KEY_PREFIX = "nightplay-progress:";
export const AGE_GATE_KEY = "nightplay-18-ok";
