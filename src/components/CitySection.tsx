function goToSignup() {
    const input = document.getElementById('join-email');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.setTimeout(() => input?.focus({ preventScroll: true }), 500);
}

export function CitySection() {
    return (
        <section className="city" id="map" aria-labelledby="city-title">
            <figure className="city__map">
                <img
                    src="/lundun-map.png"
                    alt="The in-game map of Lundun, with its districts either side of the river"
                    width={470}
                    height={556}
                    loading="lazy"
                />
                <figcaption>In-game map · Lundun</figcaption>
            </figure>

            <div className="city__copy">
                <p className="eyebrow">The game</p>
                <h2 id="city-title">Open-world Lundun. Underworld rules.</h2>
                <p className="city__lede">
                    Lundun After Dark is an open-world crime game set in a London that never quite sleeps. Run jobs, earn rewards,
                    and find out who really runs the city after dark.
                </p>

                <div className="city__foot">
                    <button type="button" className="city__cta" onClick={goToSignup}>
                        Get first access
                    </button>
                    <span className="city__platforms">iPhone · Android · Browser · End of 2026</span>
                </div>
            </div>
        </section>
    );
}