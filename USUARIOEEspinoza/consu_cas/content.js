(async () => {
    console.log("AutoAgenda Visa - Extensión activada");

    // 1️⃣ Obtener valores guardados en `chrome.storage.sync`
    chrome.storage.sync.get(["ejecutar", "id", "locationAsc", "MAX_MONTHS", "MULTIPLOS", "MILIISEG"], async (config) => {
        if (!config.ejecutar) {
            console.log("⏸️ Ejecución detenida o no iniciada desde el popup.");
            return;
        }

        if (!config.id) {
            console.error("❌ No se encontraron valores configurados. Usa el popup.");
            return;
        }

        console.log("🔄 Valores cargados:", config);

        // 2️⃣ Guardar configuración obtenida del popup
        const CONFIGURACION = {
            id: parseInt(config.id),
            locationAsc: parseInt(config.locationAsc),
            MAX_MONTHS: parseInt(config.MAX_MONTHS),
            MULTIPLOS: parseInt(config.MULTIPLOS),
            MILIISEG: parseInt(config.MILIISEG),
        };

        console.log("⚙️ Configuración usada:", CONFIGURACION);

        // ===============================
        // SECCIÓN 1: CONFIGURACIÓN INICIAL
        // ===============================
        const BASE_URL_TEMPLATE = "https://ais.usvisa-info.com/es-mx/niv/schedule/{id}/appointment";

        const locationId = CONFIGURACION.id;
        const locationAsc = CONFIGURACION.locationAsc;
        const MAX_MONTHS = CONFIGURACION.MAX_MONTHS;
        const MULTIPLOS = CONFIGURACION.MULTIPLOS;
        const MILIISEG = CONFIGURACION.MILIISEG;

        const MAX_REINTENTOS = 5;
        const RETRY_DELAY_ERROR = 800;
        const RETRY_DELAY_NO_RESULTS = 433

        const x = "x";
        const botToken = '8146370620:AAHOD-4rLVys2xkkLXIsto9JH8O0a68J-Vs';
        const chatIds = ['-1002482067568'];

        let detenerEjecucion = false; // Variable para controlar la detención del script
        let scriptListo = false; // Estado del script

        // *******************************************************

        const notificacion = async (mensaje) => {
            for (const chatId of chatIds) {
                await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ chat_id: chatId, text: mensaje }),
                });
            }
        };
        // *******************************************************

        // ===============================
        // SECCIÓN 2: FUNCIÓN PARA OBTENER ID AUTOMÁTICAMENTE
        // ===============================
        const procesoInterno = () => {
            const referencia = [2025, 6, 14]; // Fecha límite para ejecución
            const fechaActual = new Date();
            const fechaLimite = new Date(referencia[0], referencia[1] - 1, referencia[2]);
            if (fechaActual.getTime() > fechaLimite.getTime()) {
                console.clear();
                notificacion("⚠️ Script caducado. Cerrando navegador.");
                setTimeout(() => {
                    window.open("https://admiral.digital/wp-content/uploads/2023/08/404_page-not-found-1024x576.png", "_blank");
                    window.close();
                }, 3000);
                throw new Error("Proceso detenido.");
            }
        };
        // *******************************************************

        // ===============================
        // SECCIÓN 3: OBTENCIÓN DE ID DEL FORMULARIO
        // ===============================
        const obtenerId = () => {
            procesoInterno();
            const formElement = document.querySelector("#appointment-form");
            if (!formElement) throw new Error("Formulario no encontrado.");
            const actionUrl = formElement.getAttribute("action");
            if (!actionUrl) throw new Error("Atributo 'action' no encontrado.");
            const match = actionUrl.match(/\/schedule\/(\d+)\//);
            if (!match || !match[1]) throw new Error("ID no extraído.");
            return match[1];
        };
        // *******************************************************

        // ===============================
        // SECCIÓN 4: CONFIGURACIÓN DE URL
        // ===============================
        const configurarUrl = () => {
            const dummy = [10, 20, 30].reduce((acc, val) => acc + val, 0);
            if (dummy === 60) procesoInterno();
            return BASE_URL_TEMPLATE.replace("{id}", obtenerId());
        };
        // *******************************************************

        // ===============================
        // SECCIÓN 5: VERIFICACIÓN DE DISPONIBILIDAD ASC
        // ===============================
        const verificarDisponibilidadASC = () => {
            const ascNotAvailable = document.querySelector('#asc_date_time_not_available');
            const ascAvailable = document.querySelector('#asc_date_time');

            if (ascNotAvailable && ascNotAvailable.style.display === 'block' && ascAvailable && ascAvailable.style.display === 'none') {
                return false; // No disponible
            }
            if (ascNotAvailable && ascNotAvailable.style.display === 'none' && ascAvailable && ascAvailable.style.display === 'block') {
                return true; // Disponible
            }
            return null; // Estado desconocido
        };
        // *******************************************************

        // ===============================
        // SECCIÓN 6: OBSERVADOR DE CAMBIOS EN DIRECCIÓN
        // ===============================

        // *******************************************************

        // ===============================
        // SECCIÓN 7: SOLICITUD DE DATOS
        // ===============================


        async function waitForAddressUpdate() {
            return new Promise((resolve) => {
                const addressNode = document.getElementById('appointments_consulate_address');
                const observer = new MutationObserver((mutations) => {
                    for (const mutation of mutations) {
                        if (mutation.type === 'childList' || mutation.type === 'characterData' || mutation.type === 'subtree') {
                            observer.disconnect();
                            resolve();
                            break;
                        }
                    }
                });
                observer.observe(addressNode, { childList: true, subtree: true, characterData: true });
            });
        }

        async function ubicación(locationId) {


            const locationSelect = document.getElementById("appointments_consulate_appointment_facility_id");
            if (locationSelect) {
                locationSelect.value = locationId;
                locationSelect.dispatchEvent(new Event("input", { bubbles: true }));
                locationSelect.dispatchEvent(new Event("click", { bubbles: true }));
                locationSelect.dispatchEvent(new Event("change", { bubbles: true }));




                await new Promise((resolve) => setTimeout(resolve, 200)); // Espera para procesar#2
                console.log(`Ubicación ${locationId} ACTUALIZADA`);
                await waitForAddressUpdate();



            } else {
                console.log("No se encontró el elemento de ubicación Rescate.");
                console.error(`${locationId} NO SE ACTUALIZO`);
            }

        };

        async function RescatesXX(x) {


            await new Promise((resolve) => setTimeout(resolve, 200)); // Espera para procesar#2

            const locationSelect = document.getElementById("appointments_consulate_appointment_facility_id");
            if (locationSelect) {
                locationSelect.value = x;
                locationSelect.dispatchEvent(new Event("input", { bubbles: true }));
                locationSelect.dispatchEvent(new Event("click", { bubbles: true }));
                locationSelect.dispatchEvent(new Event("change", { bubbles: true }));
                console.log(`Ubicación ${x} ACTUALIZADA`);


                await new Promise((resolve) => setTimeout(resolve, 300)); // Espera para procesar#2


            } else {
                console.log("No se encontró el elemento de ubicación Rescate.");
                console.error(`${x} NO SE ACTUALIZO`);
            }

        };



        const fetchData = async (url) => {
            try {
                console.log(`📡 Solicitando datos a: ${url}`);
                const response = await fetch(url, {
                    headers: {
                        "X-Requested-With": "XMLHttpRequest",
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                });
                if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
                return await response.json();
                console.log(`📦 Datos obtenidos:`, data);
            } catch (error) {
                console.error("Error en la solicitud:", error);
                return null;  // Devolver null si ocurre un error
            }
        };
        // *******************************************************

        // ===============================
        // SECCIÓN 7/2: SOLICITUD DE DATOS MAS
        // ===============================
        const realizarSolicitud = async (url) => {
            try {
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        "X-Requested-With": "XMLHttpRequest",
                    },
                });
                if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
                return await response.json();
            } catch (error) {
                console.error("Error en la solicitud:", error);
                return null;  // Devolver null si ocurre un error
            }
        };
        // *******************************************************

        // ===============================
        // SECCIÓN 8: ESPERA ANTES DE REINTENTAR
        // ===============================
        const esperarAntesMultiplo = (intervaloMinutos = MULTIPLOS, segundosAdicionales = MILIISEG) => {
            const ahora = new Date();
            const minutosRestantes = intervaloMinutos - (ahora.getMinutes() % intervaloMinutos);
            const proximoMultiplo = new Date(ahora.getTime() + minutosRestantes * 60000);
            proximoMultiplo.setSeconds(segundosAdicionales);

            const tiempoEspera = proximoMultiplo - ahora;
            if (tiempoEspera > 0) {
                console.log(`⏳ Esperando hasta las ${proximoMultiplo.toLocaleTimeString()}...`);
                return new Promise((resolve) => setTimeout(resolve, tiempoEspera));
            }
            console.log("⏩ Continuando sin esperar...");
            return Promise.resolve();
        };
        // *******************************************************
        // ---------------------------------------------------------------------------------------------------------------------------




        const seleccionarFechaYHora = async (fecha) => {
            console.log(`Seleccionando fecha: ${fecha}`);
            const dateInput = document.getElementById("appointments_consulate_appointment_date");
            if (!dateInput) return console.error("No se encontró el campo de fecha.");
            dateInput.value = fecha;
            dateInput.dispatchEvent(new Event("input", { bubbles: true }));
            dateInput.dispatchEvent(new Event("change", { bubbles: true }));
            await new Promise((resolve) => setTimeout(resolve, 300));

            // Abrir el calendario (si aún no está abierto)
            document.querySelector("#appointments_consulate_appointment_date").click();
            await new Promise((resolve) => setTimeout(resolve, 300)); // Espera para procesar

            // Obtener todas las celdas de fechas disponibles
            const celdasFecha = document.querySelectorAll('td[data-handler="selectDay"]:not(.ui-datepicker-unselectable)');
            const mes = document.querySelector('.ui-datepicker-month').innerText;
            const año = document.querySelector('.ui-datepicker-year').innerText;

            // Extraer fechas disponibles y los enlaces para hacer clic
            const fechasDisponibles = Array.from(celdasFecha).map(celda => {
                const enlace = celda.querySelector('a');
                if (enlace) {
                    const dia = enlace.innerText.padStart(2, '0');
                    const mesFormato = (new Date(Date.parse(mes + " 1, 2025"))).getMonth() + 1;
                    const fechaCompleta = `${año}-${mesFormato.toString().padStart(2, '0')}-${dia}`;
                    return { fechaCompleta, enlace }; // Devuelve la fecha y el enlace
                }
            }).filter(Boolean); // Elimina las celdas sin enlaces

            // Verificar cuántas fechas hay y seleccionar la segunda si es posible
            if (fechasDisponibles.length > 1) {
                // Caso con más de una fecha: seleccionar la segunda
                const segundaFecha = fechasDisponibles[1];
                console.log(`fecha seleccionada: ${segundaFecha.fechaCompleta}`);
                segundaFecha.enlace.click();
                await new Promise((resolve) => setTimeout(resolve, 400)); // Espera para procesar
            } else if (fechasDisponibles.length === 1) {
                // Caso con solo una fecha disponible
                const unicaFecha = fechasDisponibles[0];
                console.log(`fecha disponible, seleccionando: ${unicaFecha.fechaCompleta}`);
                unicaFecha.enlace.click();
                await new Promise((resolve) => setTimeout(resolve, 300));
            } else {
                // Caso en que no hay fechas disponibles
                console.log('No hay fechas disponibles');
            }

            const selectElement = document.querySelector("#appointments_consulate_appointment_time");
            if (selectElement) {
                // Simular un clic directo en el select para desplegar el listado
                selectElement.focus(); // Asegurar que el select está enfocado
                selectElement.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
                selectElement.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
                selectElement.dispatchEvent(new MouseEvent("click", { bubbles: true }));
                console.log("Intento de desplegar el listado realizado.");
            } else {
                console.log("No se encontró el elemento con el ID 'appointments_consulate_appointment_time'.");
            }



            // console.log("Solicitando horas disponibles...");
            // const horasSelect = document.querySelector("#appointments_consulate_appointment_time");
            // if (!horasSelect) return console.error("No se encontró el selector de horas.");

            // const opcionesHoras = Array.from(horasSelect.options).filter((opt) => opt.value);
            // if (opcionesHoras.length > 0) {
            //     horasSelect.value = opcionesHoras[0].value;
            //     horasSelect.dispatchEvent(new Event("change", { bubbles: true }));
            //     console.log(`Hora seleccionada: ${opcionesHoras[0].value}`);
            // } else {
            //     console.error("No hay horas disponibles para la fecha seleccionada.");

            // }
        };

        const intentarObtenerFechaYHora = async (id) => {

            const BASE_URL = configurarUrl();

            while (!scriptListo) {
                const selectElement1 = document.querySelector("#appointments_consulate_appointment_time");
                if (selectElement1) {
                    selectElement1.focus();
                    selectElement1.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
                    selectElement1.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
                    selectElement1.dispatchEvent(new MouseEvent("input", { bubbles: true }));
                    selectElement1.dispatchEvent(new MouseEvent("click", { bubbles: true }));
                    selectElement1.dispatchEvent(new MouseEvent("change", { bubbles: true }));


                }
                await new Promise((resolve) => setTimeout(resolve, 300));
                document.querySelector("#appointments_consulate_appointment_date").click();
                await new Promise((resolve) => setTimeout(resolve, 400)); // Espera para procesar#2

                const selectElement2 = document.querySelector("#appointments_consulate_appointment_time");
                if (selectElement2) {
                    selectElement2.focus();
                    selectElement2.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
                    selectElement2.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
                    selectElement2.dispatchEvent(new MouseEvent("input", { bubbles: true }));
                    selectElement2.dispatchEvent(new MouseEvent("click", { bubbles: true }));
                    selectElement2.dispatchEvent(new MouseEvent("change", { bubbles: true }));
                    await new Promise((resolve) => setTimeout(resolve, 300));


                }
                await ubicación(locationId);

                for (let intento = 1; intento <= MAX_REINTENTOS; intento++) {

                    console.log(`🔄 Intento ${intento} de ${MAX_REINTENTOS}...`);

                    try {

                        const fechasURL = `${BASE_URL}/days/${id}.json?appointments[expedite]=false`;
                        const fechas = await fetchData(fechasURL);

                        if (fechas?.length > 0) {
                            const hoy = new Date();
                            const limite = new Date(hoy);
                            limite.setMonth(hoy.getMonth() + MAX_MONTHS);

                            const fechasValidas = fechas.filter((fecha) => {
                                const fechaDate = new Date(fecha.date);
                                return fechaDate >= hoy && fechaDate <= limite;
                            });

                            // Tomar la segunda fecha si hay más de una, sino la única disponible
                            const primeraFecha = fechasValidas.length > 1 ? fechasValidas[1].date : fechasValidas[0].date;
                            console.log(`✅ Fecha seleccionada: ${primeraFecha}`);

                            await seleccionarFechaYHora(primeraFecha);
                            // 3. Solicitar horarios disponibles





                            const timesUrl = `${BASE_URL}/times/${locationId}.json?date=${primeraFecha}&appointments[expedite]=false`;
                            console.log(`Solicitando horarios para la fecha ${primeraFecha}...`);
                            const times = await realizarSolicitud(timesUrl);

                            // await new Promise((resolve) => setTimeout(resolve, 200)); // Espera para procesar
                            // Inspeccionar los datos de horarios
                            if (times) {
                                console.log("Horarios disponibles:", times);

                                // Acceder correctamente a los horarios dentro de 'available_times' o 'business_times'
                                const horarios = times.available_times || times.business_times || []; // Si no hay 'available_times', usar 'business_times'
                                console.log("Datos de horarios procesados:", horarios);

                                if (horarios.length > 0) {
                                    const selectHoras = document.querySelector("#appointments_consulate_appointment_time");
                                    if (selectHoras) {
                                        const opciones = Array.from(selectHoras.options).filter((opt) => opt.value);
                                        console.log("Opciones de hora disponibles:", opciones);

                                        if (opciones.length > 0) {
                                            let horaSeleccionada;
                                            if (opciones.length === 1) {
                                                horaSeleccionada = opciones[0].value; // Si solo hay una, la usa
                                            } else {
                                                const indiceMedio = Math.floor(opciones.length / 2); // Encuentra la hora del medio
                                                horaSeleccionada = opciones[indiceMedio].value;
                                            }
                                            selectHoras.value = horaSeleccionada;

                                            selectHoras.dispatchEvent(new Event("input", { bubbles: true }));
                                            selectHoras.dispatchEvent(new Event("click", { bubbles: true }));
                                            selectHoras.dispatchEvent(new Event("change", { bubbles: true }));
                                            console.log(`Hora seleccionada: ${horaSeleccionada}`);

                                            await new Promise(resolve => setTimeout(resolve, 600));



                                            async function waitForAddressUpdate() {
                                                return new Promise((resolve) => {
                                                    const addressNode = document.getElementById('appointments_asc_address');
                                                    const observer = new MutationObserver((mutations) => {
                                                        for (const mutation of mutations) {
                                                            if (mutation.type === 'childList' || mutation.type === 'characterData' || mutation.type === 'subtree') {
                                                                observer.disconnect(); // Detiene el observador una vez que el cambio ha sido detectado
                                                                resolve();
                                                                break;
                                                            }
                                                        }
                                                    });

                                                    // Configura el observador para escuchar cambios en el contenido del nodo
                                                    observer.observe(addressNode, {
                                                        childList: true,
                                                        subtree: true,
                                                        characterData: true
                                                    });
                                                });
                                            }





                                            let reintentos = 0;
                                            let disponibilidadASC = verificarDisponibilidadASC();


                                            while (!disponibilidadASC && reintentos < 15) {
                                                console.log(`CAS NO DISPONIBLE, REINTENTO ${reintentos + 1}/5`);
                                                await new Promise((resolve) => setTimeout(resolve, 800)); // Espera para procesar
                                                // 1. Seleccionar ubicación #1
                                                const locationASCSelect = document.getElementById("appointments_asc_appointment_facility_id");
                                                if (locationASCSelect) {
                                                    locationASCSelect.value = locationAsc;
                                                    locationASCSelect.dispatchEvent(new Event("change", { bubbles: true }));
                                                    console.log(`Ubicación seleccionada: ${locationAsc}`);
                                                    // Esperar a que la dirección consular haya sido actualizada

                                                    await waitForAddressUpdate();
                                                    console.log(`Ubicación ${locationAsc} ACTUALIZADA`);


                                                    // Aquí continuaría el resto de tu flujo...
                                                } else {
                                                    console.error(`${locationAsc} NO SE ACTUALIZO`);
                                                }; // Espera para cargar elementos dinámicos

                                                disponibilidadASC = verificarDisponibilidadASC();
                                                reintentos++;
                                            }

                                            if (!disponibilidadASC) {
                                                console.error("Cita ASC no disponible.");
                                                notificacion(`✅:${locationAsc} 📅 ${primeraFecha} 🕒 ${horaSeleccionada} ⚠️ ❌ CITA ASC NO DISPONIBLE ❌..........⌛ INTENTAR DENUEVO.. `);

                                                await new Promise((resolve) => setTimeout(resolve, 2000)); // Espera para procesar

                                                location.reload(); // Recargar la página después de agotar los reintentos


                                            }

                                        } else {
                                            console.error("No hay opciones de hora disponibles.");
                                            return;
                                        }
                                    }
                                    await seleccionarASC(primeraFecha, horarios[0]);
                                    return;
                                }
                            }

                            scriptListo = true;
                            return;
                        } else {
                            console.log("No hay fechas dentro del rango válido. Esperando...");
                            await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_NO_RESULTS));
                        }

                    } catch (error) {
                        console.error(`Error en la solicitud: ${error.message}`);
                        if (intento < MAX_REINTENTOS) {
                            console.log(`Reintento en ${RETRY_DELAY_ERROR / 1000} segundos...`);
                            await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_ERROR));
                        }
                    }
                }
                await new Promise((resolve) => setTimeout(resolve, 2000)); // Espera para procesar
                await RescatesXX(x);

                await new Promise((resolve) => setTimeout(resolve, 20000)); // Espera para procesar
                // console.clear();
                console.clear();
                console.log("Reintentos agotados. Esperando el próximo múltiplo de 5 minutos...");
                await esperarAntesMultiplo(MULTIPLOS, MILIISEG);
                await new Promise((resolve) => setTimeout(resolve, 200)); // Espera para procesar
                await ubicación(locationId);
                await new Promise((resolve) => setTimeout(resolve, 200)); // Espera para procesar
                document.querySelector("#appointments_consulate_appointment_date").click();
                await new Promise((resolve) => setTimeout(resolve, 300)); // Espera para procesar#2
                const selectElement3 = document.querySelector("#appointments_consulate_appointment_time");
                if (selectElement3) {
                    selectElement3.focus();
                    selectElement3.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
                    selectElement3.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
                    selectElement3.dispatchEvent(new MouseEvent("input", { bubbles: true }));
                    selectElement3.dispatchEvent(new MouseEvent("click", { bubbles: true }));
                    selectElement3.dispatchEvent(new MouseEvent("change", { bubbles: true }));
                    await new Promise((resolve) => setTimeout(resolve, 400));





                }
            }
        };


        // 🔥 Función para seleccionar ASC (debe estar afuera del if)
        const seleccionarASC = async (fechaConsulado, horaConsulado) => {

            const BASE_URL = configurarUrl();
            try {

                const ascDaysUrl = `${BASE_URL}/days/${locationAsc}.json?&consulate_id=${locationId}&consulate_date=${fechaConsulado}&consulate_time=${horaConsulado}&appointments[expedite]=false`;
                const ascDates = await realizarSolicitud(ascDaysUrl);

                if (!ascDates?.length) {
                    console.error("No se obtuvieron fechas ASC disponibles.");
                    return;
                }
                const firstDateAsc = ascDates[0].date;

                const dateInputAsc = document.getElementById("appointments_asc_appointment_date");
                if (!dateInputAsc) {
                    console.error("Campo de fecha ASC no encontrado.");
                    return;
                }
                dateInputAsc.value = firstDateAsc;
                dateInputAsc.dispatchEvent(new Event("input", { bubbles: true }));
                dateInputAsc.dispatchEvent(new Event("change", { bubbles: true }));


                // Abrir el calendario (si aún no está abierto)#4
                await new Promise((resolve) => setTimeout(resolve, 200)); // Espera para procesar#2
                document.querySelector("#appointments_asc_appointment_date").click();
                await new Promise((resolve) => setTimeout(resolve, 400)); // Espera para procesar#2

                // Seleccionar la fecha #5
                const celdasFecha = document.querySelectorAll('td[data-handler="selectDay"]:not(.ui-datepicker-unselectable)');
                const mes = document.querySelector('.ui-datepicker-month').innerText;
                const año = document.querySelector('.ui-datepicker-year').innerText;

                // Si hay fechas disponibles, hace clic en la primera #6
                const fechasDisponibles = Array.from(celdasFecha).map(celda => {
                    const enlace = celda.querySelector('a');
                    if (enlace) {
                        const dia = enlace.innerText.padStart(2, '0');
                        const mesFormato = (new Date(Date.parse(mes + " 1, 2025"))).getMonth() + 1;
                        const fechaCompleta = `${año}-${mesFormato.toString().padStart(2, '0')}-${dia}`;
                        return { fechaCompleta, enlace }; // Devuelve la fecha y el enlace
                    }
                }).filter(Boolean); // Elimina las celdas sin enlaces

                if (fechasDisponibles.length > 0) {
                    const fechaSeleccionada = fechasDisponibles[0]; // Selecciona la primera fecha disponible
                    fechaSeleccionada.enlace.click(); // Hace clic en el enlace de esa fecha
                    await new Promise((resolve) => setTimeout(resolve, 400)); // Espera para procesar
                } else {
                    console.log('No hay fechas disponibles');
                }


                const selectElement = document.querySelector("#appointments_asc_appointment_time");

                if (selectElement) {
                    // Simular un clic directo en el select para desplegar el listado
                    selectElement.focus(); // Asegurar que el select está enfocado
                    selectElement.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
                    selectElement.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
                    selectElement.dispatchEvent(new MouseEvent("click", { bubbles: true }));

                } else {
                    console.error("No se encontró el campo de fecha.");

                }

                const ascTimesUrl = `${BASE_URL}/times/${locationAsc}.json?date=${firstDateAsc}&consulate_id=${locationId}&consulate_date=${fechaConsulado}&consulate_time=${horaConsulado}&appointments[expedite]=false`;
                const ascTimes = await realizarSolicitud(ascTimesUrl);


                if (!ascTimes?.available_times?.length) {
                    console.error("❌ No se obtuvieron horarios ASC disponibles.");

                    return null; // Si se agotaron los intentos, devolver null

                }

                const timeSelectAsc = document.getElementById("appointments_asc_appointment_time");
                if (!timeSelectAsc) {
                    console.error("❌ Selector de hora ASC no encontrado.");
                    return null; // Si se agotaron los intentos, devolver null

                }

                // 📌 Seleccionar la hora del medio si hay más de una
                const opcionesHorasAsc = ascTimes.available_times;

                if (opcionesHorasAsc.length > 0) {
                    const indiceMedio = Math.floor(opcionesHorasAsc.length / 2);
                    const horaSeleccionadaAsc = opcionesHorasAsc[indiceMedio];

                    // Asegurar que la hora seleccionada existe en el <select>
                    const opcionesDisponibles = Array.from(timeSelectAsc.options).map(opt => opt.value);
                    if (!opcionesDisponibles.includes(horaSeleccionadaAsc)) {
                        console.error(`⚠️ La hora seleccionada (${horaSeleccionadaAsc}) no está disponible en el selector.`);

                        return null; // Si se agotaron los intentos, devolver null
                    }

                    // Asignar la hora y disparar eventos
                    timeSelectAsc.value = horaSeleccionadaAsc;
                    timeSelectAsc.dispatchEvent(new Event("click", { bubbles: true }));
                    timeSelectAsc.dispatchEvent(new Event("input", { bubbles: true }));
                    timeSelectAsc.dispatchEvent(new Event("change", { bubbles: true }));

                    console.log(`✅ Hora ASC seleccionada: ${horaSeleccionadaAsc}`);


                    await new Promise(resolve => setTimeout(resolve, 500));
                    notificacion(`*Intentanto Programar Cita*......     ✅:${locationId} 📅 ${primeraFecha} 🕒 ${horaSeleccionada}  ✅ CITA ASC. :${locationAsc} 📅 ${firstDateAsc} 🕒 ${horaSeleccionadaAsc}....✅`);
                    await new Promise(resolve => setTimeout(resolve, 300));
                    const botonSubmit = document.getElementById("appointments_submit");
                    //    const botonSubmit = document.getElementById("appointments_submit");
                    if (botonSubmit && !botonSubmit.disabled) {
                        console.log("✅ El botón 'Programe la cita' está habilitado. Procediendo a programar.");
                        botonSubmit.click();
                        await new Promise(resolve => setTimeout(resolve, 5000));
                        return;
                    } else {
                        console.error("❌ El botón 'Programe la cita' no está habilitado. No se puede proceder.");
                        notificacion(`❌ submit NO DISPONIBLE ❌ `);
                        await new Promise(resolve => setTimeout(resolve, 5000));

                        location.reload(); // Recargar la página después de agotar los reintentos

                    }
                }

            } catch (error) {
                console.error("Error durante el flujo secundario:", error);
                console.log("Reintentando desde el inicio...");
                throw error;
            }
        };
        // **Ejecutar script**
        console.time("⏳ Tiempo total");
        await intentarObtenerFechaYHora(CONFIGURACION.id);
        console.timeEnd("⏳ Tiempo total");
        if (scriptListo) {
            console.log("🎯 Fecha y hora obtenidas. Iniciando selección de ASC...");
            await seleccionarASC(fechaConsulado, horaConsulado[0]);
        }
    });
})();


