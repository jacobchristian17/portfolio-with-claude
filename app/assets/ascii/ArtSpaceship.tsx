export default function ArtSpaceship() {
    const N = 1;
    return (
        <div className="sticky inset-0 h-1/2 max-sm:h-1/4 m-auto relative z-0">
            <div className="absolute bottom-0 right-0 h-full">
                {Array(N).fill(null).map((_, i) =>
                <div key={`art-${i}`}className="leading-none whitespace-pre-wrap text-left text-sm max-sm:text-[0.35rem] spaceship">
                    {""}                                                                                         888           d8b<br />
                    {""}                                                                                         888           Y8P                 <br />
                    {""}                                                                                         888                            <br />
                    {""}.d8888b 88888b.  88888b.    .d888b   .d888b.   .d8888b  88888b.    8888888888b..d8888b  <br />
                    {""}88K        888  "88b      "88b  d88P"  d8P     Y8888K         888    "88b888 888  "88b88K      <br />
                    {""}"Y8888b.888    888.d888888888     88888888"Y8888b.   888      888888 888    888"Y8888b. <br />
                    {""}          X8888   d88P88     88Y88b.   Y88b.                  X88888      888888 888   d8P        X88 <br />
                    {""}  88888P'88888P" "Y888888  "Y888P "Y88888  88888P'  888      888888 88888P"8888888P' <br />
                    {""}              888                                                                                             888              <br />
                    {""}              888                                                                                             888              <br />
                    {""}              888                                                                                             888    <br />
                </div>
            )}
            </div>
        </div>

    )
}