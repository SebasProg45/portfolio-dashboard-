export default function SobreMiPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Sobre mí</h1>
      <div className="mt-6 max-w-2xl space-y-4 text-muted">
        <p>
          Soy Sebastian González, desarrollador de software. Este portafolio
          está construido con Next.js y despliega un dashboard que analiza mi
          propia actividad de GitHub en tiempo real: rachas de commits,
          lenguajes más usados y patrones de actividad.
        </p>
        <p>
          Escribe aquí tu historia: experiencia, stack con el que trabajas,
          y qué tipo de proyectos te interesan.
        </p>
      </div>
    </div>
  );
}
