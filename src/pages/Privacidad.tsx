export const Privacidad = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-16 flex-1 w-full bg-white dark:bg-transparent">
            <h1 className="text-3xl md:text-5xl font-bold mb-8 text-[#0d131b] dark:text-white border-b pb-4">Política de Privacidad</h1>
            <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 space-y-6">
                <p>
                    La presente Política de Privacidad describe de manera detallada cómo se recopilan, utilizan, almacenan y protegen los datos personales de los usuarios (compradores y vendedores) en la plataforma HUELLA 360.
                </p>
                <p>
                    Toda la información recolectada es tratada en estricto cumplimiento de la Ley de Protección de Datos Personales del Perú (Ley N° 29733) y su Reglamento. El titular de la plataforma y responsable del tratamiento de los datos es la empresa <strong>SUPERINKA.COM E.I.R.L.</strong>, identificada con RUC N° 20606677074, con domicilio en Calle Ramón Zavala 790, Urb Las Moreras, distrito de La Perla, provincia Callao y departamento de Callao, Perú.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-[#0d131b] dark:text-white">BANCOS DE DATOS REGISTRADOS</h2>
                <p>Los datos personales recabados a través de la plataforma serán almacenados de forma segura en los bancos de datos de titularidad de la Empresa, los cuales se encuentran debidamente inscritos (o en proceso de inscripción) ante el Registro Nacional de Protección de Datos Personales:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Banco de Datos "Usuarios y Compradores":</strong> Diseñado para almacenar la información de los clientes de la plataforma.</li>
                    <li><strong>Banco de Datos "Vendedores y Comercios":</strong> Diseñado para almacenar la información de las veterinarias y pet shops afiliados.</li>
                </ul>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-[#0d131b] dark:text-white">DATOS PERSONALES QUE RECOPILAMOS</h2>
                <p>Para el correcto uso de las funciones de la plataforma, recolectamos la siguiente información según el perfil del usuario:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Datos del Comprador/Cliente:</strong> Nombres y apellidos, DNI o Carné de Extranjería, correo electrónico, celular, dirección de entrega (delivery) y datos de su mascota (nombre, especie, raza y edad).</li>
                    <li><strong>Datos del Vendedor/Comercio:</strong> Nombre comercial, razón social, número de RUC, dirección física, nombres y apellidos del representante legal, número de colegiatura del Médico Veterinario (CMVP) y datos de la cuenta bancaria.</li>
                    <li><strong>Datos de Navegación:</strong> Dirección IP, identificadores de cookies, tipo de navegador y comportamiento de uso dentro del Sitio.</li>
                </ul>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-[#0d131b] dark:text-white">FINALIDADES NECESARIAS PARA EL TRATAMIENTO</h2>
                <p>La Empresa procesará los datos personales únicamente para las siguientes finalidades esenciales vinculadas al marketplace:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Gestionar la creación, mantenimiento y validación de cuentas.</li>
                    <li>Facilitar la intermediación comercial entre compradores y vendedores para la venta o agendamiento de citas.</li>
                    <li>Procesar y recaudar pagos a través de pasarelas.</li>
                    <li>Enviar notificaciones del estado de pedidos, citas y alertas.</li>
                    <li>Atender reclamos presentados en el Libro de Reclamaciones Virtual.</li>
                    <li>Prevenir fraudes, suplantaciones de identidad y asegurar la integridad tecnológica.</li>
                </ul>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-[#0d131b] dark:text-white">FINALIDADES OPCIONALES</h2>
                <p>Solo si el usuario lo autoriza expresamente (opt-in), la Empresa podrá utilizar sus datos para:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Enviar promociones, boletines informativos, descuentos y ofertas de productos o servicios.</li>
                    <li>Realizar encuestas de satisfacción y estudios de mercado.</li>
                </ul>
                <p className="text-sm italic">Nota: La negativa a autorizar estas finalidades opcionales no impedirá el uso básico de la plataforma ni la realización de compras.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-[#0d131b] dark:text-white">PLAZO DE CONSERVACIÓN DE LOS DATOS</h2>
                <p>
                    Los datos se conservarán mientras la relación comercial y la cuenta permanezcan activas. Una vez cancelada la cuenta, se procederá a eliminar o anonimizar los datos, salvo aquellos que deban conservarse por plazos legales obligatorios (ej. tributarios).
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-[#0d131b] dark:text-white">TRANSFERENCIA DE DATOS PERSONALES (DESTINATARIOS)</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Al Vendedor / Comercio Aliado:</strong> Se transferirán datos de contacto y entrega del Comprador para realizar el despacho o atender la cita.</li>
                    <li><strong>A las Pasarelas de Pago:</strong> Proveedores tecnológicos para el procesamiento seguro de cobros.</li>
                    <li><strong>A empresas de mensajería o hosting:</strong> Proveedores de servidores y envío de correos electrónicos.</li>
                </ul>
                <p>La Empresa garantiza que sus proveedores cumplen con los estándares de seguridad exigidos por ley.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-[#0d131b] dark:text-white">TRANSFERENCIA INTERNACIONAL DE DATOS (FLUJO TRANSFRONTERA)</h2>
                <p>
                    El usuario toma conocimiento y otorga su consentimiento de que los servidores que alojan la plataforma pertenecen a proveedores en la nube (AWS, Google Cloud, etc.) cuyas infraestructuras pueden estar ubicadas fuera del territorio peruano.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-[#0d131b] dark:text-white">AUDITORÍA LEGAL DE MENSAJERÍA INTERNA</h2>
                <p>
                    En concordancia con los Términos y Condiciones, el usuario acepta expresamente que la Empresa pueda monitorear y revisar las conversaciones del chat interno con la única finalidad de auditar tratos por fuera del sistema (evasión de comisiones) o detectar conductas que atenten contra la seguridad y bienestar animal.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-[#0d131b] dark:text-white">MEDIDAS DE SEGURIDAD IMPLEMENTADAS</h2>
                <p>
                    Se han implementado medidas de seguridad técnicas y organizativas para evitar la pérdida, alteración, mal uso o acceso no autorizado a los datos, incluyendo cifrado de datos, certificados SSL y control de acceso restringido.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-[#0d131b] dark:text-white">EJERCICIO DE DERECHOS ARCO</h2>
                <p>De conformidad con la normativa peruana, los usuarios tienen derecho a ejercer gratuitamente sus derechos de:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Acceso:</strong> Conocer qué datos posee la Empresa y cómo se tratan.</li>
                    <li><strong>Rectificación:</strong> Solicitar corrección de datos inexactos o incompletos.</li>
                    <li><strong>Cancelación:</strong> Solicitar eliminación de datos cuando ya no sean necesarios.</li>
                    <li><strong>Oposición:</strong> Negarse al tratamiento para finalidades específicas.</li>
                </ul>
                <p>Para ejercer estos derechos, debe enviar una solicitud formal por escrito al correo de soporte oficial, adjuntando copia legible de su DNI.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-[#0d131b] dark:text-white">MODIFICACIONES A LA POLÍTICA DE PRIVACIDAD</h2>
                <p>
                    La Empresa se reserva el derecho de modificar esta política. Cambios significativos serán notificados mediante aviso destacado en la plataforma o vía correo electrónico.
                </p>
            </div>
        </div>
    );
};
