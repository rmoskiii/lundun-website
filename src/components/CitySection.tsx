const FEATURES: { title: string; text: string }[] = [
    { title: 'Jobs that pay', text: 'Take missions across the city. Every job finished means cash and rewards.' },
    { title: 'Free roam', text: 'No story, no rules. Just you, the city and whatever you can get away with.' },
    { title: 'Turf', text: 'Gang territory shows up on your map as you find it. Cross the line at your own risk.' },
    { title: 'Get around', text: 'Cars, bikes, the Underground, and GPS to anywhere in Lundun.' },
];

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

                <ul className="city__features">
                    {FEATURES.map((f) => (
                        <li key={f.title}>
                            <h3>{f.title}</h3>
                            <p>{f.text}</p>
                        </li>
                    ))}
                </ul>

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