import { createClient }
from "https://esm.sh/@supabase/supabase-js@2";


const supabaseUrl =
    "https://zavihytoornyjsgpzall.supabase.co";


const supabaseKey =
    "sb_publishable_-3maTypkZk7Gpf21Q-3a0Q_5ixrsPry";

const supabase =
    createClient(
        supabaseUrl,
        supabaseKey
    );


document.addEventListener(
    "DOMContentLoaded",
    async () => {

        const yesButton =
            document.getElementById("yes");

        const container =
            document.querySelector(".container");

        const padCountDisplay =
            document.getElementById("pad-count");


        /* =====================================
           GET SINGAPORE DATE
        ===================================== */

        function getSingaporeDate() {

            return new Intl.DateTimeFormat(
                "en-CA",
                {
                    timeZone:
                        "Asia/Singapore",

                    year:
                        "numeric",

                    month:
                        "2-digit",

                    day:
                        "2-digit"
                }
            ).format(
                new Date()
            );

        }


        const today =
            getSingaporeDate();


        /* =====================================
           LOAD TODAY'S COUNT
        ===================================== */

        async function loadPadCount() {

            const {
                data,
                error
            } =
                await supabase
                    .from(
                        "daily_pad_counts"
                    )
                    .select(
                        "count"
                    )
                    .eq(
                        "date",
                        today
                    )
                    .maybeSingle();


            if (error) {

                console.error(
                    "Error loading count:",
                    error
                );

                padCountDisplay.textContent =
                    "Pads Taken Today: --";

                return 0;

            }


            const count =
                data?.count ?? 0;


            padCountDisplay.textContent =
                "Pads Taken Today: " +
                count;


            return count;

        }


        await loadPadCount();


        /* =====================================
           YES BUTTON
        ===================================== */

        yesButton.addEventListener(
            "click",
            async () => {

                yesButton.disabled =
                    true;

                yesButton.textContent =
                    "Recording... 💕";


                /* =================================
                   ATOMIC +1 IN SUPABASE
                ================================= */

                const {
                    data,
                    error
                } =
                    await supabase.rpc(
                        "increment_pad_count",
                        {
                            p_date:
                                today
                        }
                    );


                if (error) {

                    console.error(
                        "Error recording pad:",
                        error
                    );


                    yesButton.disabled =
                        false;


                    yesButton.textContent =
                        "Yes 💕";


                    alert(
                        "Unable to record the pad. Please try again."
                    );


                    return;

                }


                const padCount =
                    Number(data);


                /* =================================
                   UPDATE FOOTER
                ================================= */

                padCountDisplay.textContent =
                    "Pads Taken Today: " +
                    padCount;


                /* =================================
                   THANK YOU SCREEN
                ================================= */

                container.innerHTML = `

                    <div class="counter-screen">

                        <h1>
                            Thank you! 💗
                        </h1>


                        <p class="counter-label">
                            Period pads taken today
                        </p>


                        <div class="counter-number">
                            ${padCount}
                        </div>


                        <p class="counter-message">
                            Thank you for helping us
                            track our pad usage! 🌸
                        </p>


                        <p class="counter-reminder">
                            Please take only what
                            you need 💕
                        </p>


                        <button
                            type="button"
                            id="reload-button"
                            class="yes"
                        >
                            Done 💕
                        </button>

                    </div>

                `;


                /* =================================
                   DONE BUTTON
                ================================= */

                document
                    .getElementById(
                        "reload-button"
                    )
                    .addEventListener(
                        "click",
                        () => {

                            location.reload();

                        }
                    );

            }
        );

    }
);
