export default function TapiclearLanding() {
  return (
    <main className="bg-[#eef9ff] text-slate-900 overflow-x-hidden">
      {/* WATER BACKGROUND FX */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[700px] h-[700px] bg-cyan-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[900px] h-[900px] bg-blue-300/20 rounded-full blur-3xl animate-pulse"></div>

        <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle_at_center,_#38bdf8_1px,_transparent_1px)] bg-[size:32px_32px]"></div>
      </div>

      {/* NAVBAR */}
      <header className="fixed top-0 z-50 w-full backdrop-blur-2xl bg-[#dff5ff]/70 border-b border-cyan-200/40">
        <div className="max-w-[1400px] mx-auto px-6 md:px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-cyan-700">
              Tapiclear
            </h1>

            <p className="text-[10px] uppercase tracking-[0.35em] text-cyan-500 mt-1">
              Limpieza Premium
            </p>
          </div>

          <nav className="flex gap-4 md:gap-8 text-[11px] uppercase tracking-[0.25em] text-slate-600 font-semibold">
            <a href="#inicio" className="hover:text-cyan-700 transition">
              Inicio
            </a>
            <a href="#servicios" className="hover:text-cyan-700 transition">
              Servicios
            </a>
            <a href="#resultados" className="hover:text-cyan-700 transition">
              Resultados
            </a>
            <a href="#contacto" className="hover:text-cyan-700 transition">
              Contacto
            </a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section
        id="inicio"
        className="relative min-h-screen flex items-center overflow-hidden"
      >
        {/* WATER FX */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.7),_transparent_35%)]"></div>

          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.35),_transparent_35%)]"></div>
        </div>

        {/* WAVES */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none opacity-60">
          <svg
            className="relative block w-[calc(100%+1.3px)] h-[160px]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,8.73V0Z"
              className="fill-cyan-200"
            ></path>
          </svg>
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-8 grid lg:grid-cols-2 gap-20 items-center pt-32">
          <div>
            <div className="inline-flex items-center gap-3 bg-white/70 backdrop-blur-xl border border-cyan-100 px-5 py-3 rounded-full shadow-xl shadow-cyan-100 mb-8">
              <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse"></div>

              <span className="text-[11px] uppercase tracking-[0.3em] text-cyan-700 font-bold">
                Pureza · Frescura · Detalle
              </span>
            </div>

            <h2 className="text-5xl sm:text-6xl md:text-8xl font-black leading-[0.92] tracking-tight text-slate-900">
              Tapizados
              <span className="block text-cyan-600 drop-shadow-[0_0_25px_rgba(34,211,238,0.35)]">
                impecables.
              </span>
            </h2>

            <p className="mt-8 max-w-[650px] text-lg md:text-xl leading-relaxed text-slate-600 font-light">
              Limpieza premium para sillones, colchones y vehículos con una
              estética fresca, profunda y profesional.
            </p>

            <div className="mt-10 flex flex-wrap gap-5">
              <button className="bg-cyan-600 hover:bg-cyan-700 transition-all duration-300 hover:scale-105 text-white px-8 py-5 rounded-full text-xs uppercase tracking-[0.25em] font-bold shadow-[0_20px_60px_rgba(8,145,178,0.35)]">
                Reservar servicio
              </button>

              <button className="bg-white/70 backdrop-blur-xl border border-cyan-100 hover:bg-white transition-all duration-300 hover:scale-105 text-cyan-700 px-8 py-5 rounded-full text-xs uppercase tracking-[0.25em] font-bold shadow-xl shadow-cyan-100">
                Ver resultados
              </button>
            </div>
          </div>

          {/* HERO VISUAL */}
          <div className="relative flex justify-center">
            <div className="absolute inset-0 bg-cyan-300/20 blur-3xl rounded-full"></div>

            <div className="relative w-full max-w-[560px] rounded-[40px] overflow-hidden shadow-[0_40px_100px_rgba(14,165,233,0.25)] border border-white/60 backdrop-blur-2xl">
              <img
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1600&auto=format&fit=crop"
                className="w-full h-[720px] object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/20 via-transparent to-white/10"></div>

              {/* GLASS WATER EFFECT */}
              <div className="absolute inset-0 backdrop-blur-[2px]"></div>

              {/* FLOAT CARD */}
              <div className="absolute bottom-8 left-8 right-8 bg-white/40 backdrop-blur-2xl border border-white/40 rounded-[28px] p-6 shadow-2xl">
                <p className="text-[11px] uppercase tracking-[0.25em] text-cyan-700 font-bold">
                  Acabado Premium
                </p>

                <h3 className="mt-3 text-3xl font-black text-slate-900">
                  Frescura total.
                </h3>

                <p className="mt-3 text-slate-700 leading-relaxed">
                  Restauramos textura, color y limpieza profunda.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section
        id="servicios"
        className="relative py-36 px-6 md:px-8 overflow-hidden"
      >
        <div className="max-w-[1400px] mx-auto">
          <div className="max-w-3xl">
            <p className="text-[11px] uppercase tracking-[0.4em] text-cyan-600 font-bold">
              Servicios
            </p>

            <h2 className="mt-6 text-4xl md:text-6xl font-black leading-tight text-slate-900">
              Una nueva vida para cada superficie.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-20">
            {[
              {
                title: 'Sofás & sillones',
                text: 'Limpieza profunda para recuperar frescura, textura y apariencia.',
              },
              {
                title: 'Tapizados de auto',
                text: 'Interiores renovados con detalle profesional y secado rápido.',
              },
              {
                title: 'Colchones & sillas',
                text: 'Eliminación de manchas, olores y acumulación diaria.',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="relative bg-white/60 backdrop-blur-2xl border border-white/60 rounded-[36px] p-10 overflow-hidden shadow-[0_20px_60px_rgba(14,165,233,0.08)] hover:-translate-y-2 transition-all duration-500"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-200/40 rounded-full blur-3xl"></div>

                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 mb-8 shadow-lg shadow-cyan-300/50"></div>

                  <h3 className="text-3xl font-black text-slate-900 leading-tight">
                    {item.title}
                  </h3>

                  <p className="mt-5 text-slate-600 leading-relaxed text-lg font-light">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RESULTS */}
      <section
        id="resultados"
        className="relative py-36 px-6 md:px-8 bg-gradient-to-b from-cyan-100/60 to-[#eef9ff] overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-white to-transparent"></div>

        <div className="max-w-[1400px] mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-[11px] uppercase tracking-[0.4em] text-cyan-600 font-bold">
              Resultados
            </p>

            <h2 className="mt-6 text-4xl md:text-6xl font-black text-slate-900 leading-tight">
              El cambio se siente.
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 mt-20">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="group relative rounded-[40px] overflow-hidden shadow-[0_30px_80px_rgba(14,165,233,0.18)]"
              >
                <img
                  src="https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1600&auto=format&fit=crop"
                  className="w-full h-[620px] object-cover group-hover:scale-105 transition-transform duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-cyan-950/70 via-transparent to-transparent"></div>

                <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
                  <div>
                    <p className="text-cyan-100 uppercase tracking-[0.25em] text-[10px] font-bold">
                      Antes & Después
                    </p>

                    <h3 className="mt-3 text-3xl font-black text-white">
                      Restauración visual
                    </h3>
                  </div>

                  <div className="bg-white/20 backdrop-blur-2xl border border-white/30 rounded-full px-6 py-4 text-white text-xs uppercase tracking-[0.25em] font-bold">
                    Ver detalle
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-40 px-6 md:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-700"></div>

        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:24px_24px]"></div>

        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-white/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-5xl mx-auto text-center text-white">
          <p className="text-[11px] uppercase tracking-[0.4em] font-bold text-cyan-100">
            Tapiclear
          </p>

          <h2 className="mt-6 text-5xl md:text-7xl font-black leading-[0.95]">
            Limpieza que se
            <span className="block">ve y se siente.</span>
          </h2>

          <p className="mt-8 text-xl text-cyan-100 leading-relaxed max-w-3xl mx-auto font-light">
            Restauramos tus espacios con un acabado visualmente impecable y
            profesional.
          </p>

          <button className="mt-12 bg-white text-cyan-700 px-10 py-5 rounded-full text-xs uppercase tracking-[0.3em] font-black shadow-2xl hover:scale-105 transition-all duration-300">
            Pedir presupuesto
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        id="contacto"
        className="bg-[#dff5ff] border-t border-cyan-200 py-20 px-6 md:px-8"
      >
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-start justify-between gap-12">
          <div>
            <h3 className="text-4xl font-black text-cyan-700 tracking-tight">
              Tapiclear
            </h3>

            <p className="mt-5 max-w-md text-slate-600 leading-relaxed text-lg font-light">
              Limpieza premium de tapizados con estética moderna, fresca y
              profesional.
            </p>
          </div>

          <div className="space-y-4 text-slate-600 text-sm uppercase tracking-[0.2em] font-semibold">
            <p>Instagram</p>
            <p>WhatsApp</p>
            <p>Buenos Aires · Argentina</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
