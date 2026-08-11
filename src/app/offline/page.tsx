export default function OfflinePage() {
  return (
    <main
      style={{
        minHeight: "100svh",
        display: "grid",
        placeItems: "center",
        padding: "2rem",
        background: "#07191D",
        color: "#fff",
        fontFamily: "system-ui, sans-serif",
        textAlign: "center",
      }}
    >
      <div>
        <p
          style={{
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#FF7657",
            fontSize: "0.75rem",
            fontWeight: 800,
          }}
        >
          Sem conexão
        </p>
        <h1 style={{ fontSize: "clamp(2rem, 8vw, 3.5rem)", margin: "0.6rem 0 1rem" }}>
          Floripa espera.
        </h1>
        <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: 360, margin: "0 auto" }}>
          Você está offline. Assim que a internet voltar, a contagem e o tour continuam.
        </p>
      </div>
    </main>
  );
}
