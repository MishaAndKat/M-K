import { Reveal } from "@/components/ui/reveal";

export const metadata = { title: "Админ · Night play" };

const PANELS = [
  { title: "Плейлист и разделы", desc: "Сейчас фильмы добавляются прямо на главной, в панели «Управление»." },
  { title: "Чат", desc: "Сообщения хранятся в отдельной коллекции этого сайта — старый чат не затронут." },
  { title: "Тексты сайта", desc: "Имена, часовые пояса и подписи меняются в src/lib/site-config.ts." },
];

export default function AdminDashboardPage() {
  return (
    <div className="pb-32 pt-40">
      <div className="container-page">
        <Reveal>
          <p className="eyebrow mb-4">Админ</p>
          <h1 className="font-display text-4xl font-light italic">Панель</h1>
          <p className="mt-3 max-w-lg text-sm text-mist">
            Это заготовка. Каждая карточка ниже соответствует коллекции Firestore — подключайте чтение и запись
            (см. <code className="font-mono">src/lib/firebase.ts</code>), когда понадобится.
          </p>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {PANELS.map((p) => (
            <div key={p.title} className="card-surface border-dashed p-6">
              <h3 className="font-display text-xl">{p.title}</h3>
              <p className="mt-2 text-sm text-mist">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
