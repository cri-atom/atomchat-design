import type { Integracion } from './integracion.model';

export const INTEGRACIONES_MOCK: Integracion[] = [
  {
    id: 'hubspot',
    name: 'HubSpot',
    category: 'Desarrollo y comercialización',
    description:
      'Sincroniza tus contactos de HubSpot y automatiza mensajes, campañas y flujos a través de WhatsApp de manera sencilla.',
    logoUrl: 'https://www.figma.com/api/mcp/asset/65668bae-106e-4b65-80e5-6420e22317fb',
    status: 'conectado',
  },
  {
    id: 'genesys',
    name: 'Genesys',
    category: 'Servicio al cliente',
    description:
      'Automatiza tus conversaciones con Atom y continúa la conversación con tus clientes en Genesys.',
    logoUrl: 'https://www.figma.com/api/mcp/asset/25788ecc-df33-46c7-8233-8126434337d4',
    logoBgColor: '#ff451a',
    status: 'conectar',
  },
  {
    id: 'zapier',
    name: 'Zapier',
    category: 'Conexión y tareas',
    description:
      'Zapier te permite conectar miles de aplicaciones y automatizar tu trabajo sin necesidad de utilizar código.',
    logoUrl: 'https://www.figma.com/api/mcp/asset/f0ea32fa-b1b9-4596-aa78-348b921d4d13',
    status: 'conectado',
  },
  {
    id: 'google-ads',
    name: 'Google Ads',
    category: 'Publicidad y marketing',
    description:
      'Conecta tu cuenta de Google Ads para rastrear conversiones y optimizar tus campañas publicitarias con interacciones de WhatsApp.',
    logoUrl: 'https://www.figma.com/api/mcp/asset/c1e0df51-4604-4b5f-8ba8-121d87e0c771',
    status: 'conectar',
  },
  {
    id: 'talkdesk',
    name: 'Talkdesk',
    category: 'Servicio al cliente',
    description:
      'Utiliza Atom desde Talkdesk sin tener que cambiar entre aplicaciones, facilitando así tu flujo de trabajo.',
    logoUrl: 'https://www.figma.com/api/mcp/asset/bb3f21ad-9ebd-49e7-b6b0-6f76085528de',
    status: 'conectado',
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    category: 'Gestor de clientes',
    description: 'Administra tus clientes potenciales de manera eficiente y organizada.',
    logoUrl: 'https://www.figma.com/api/mcp/asset/21936724-3fd9-4738-87d9-e37259875677',
    status: 'conectado',
  },
  {
    id: 'meta',
    name: 'Meta',
    category: 'Redes y medios sociales',
    description:
      'Configura los permisos de los diferentes aplicativos de Meta, como Ads Manager y Commerce Manager.',
    logoUrl: 'https://www.figma.com/api/mcp/asset/b9ffcfda-1d30-483b-ab46-4b5a16ba22b2',
    status: 'conectar',
  },
];
