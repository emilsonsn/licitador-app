export interface TenderOrigin {
  name: string;
  image: string;
  matches: string[];
}

export const TENDER_ORIGINS: TenderOrigin[] = [
  {name: 'BBMNET', image: 'bbmnet.jpg', matches: ['bbmnet']},
  {name: 'BLL Compras', image: 'bll.jpg', matches: ['bllcompras', 'bll.org.br']},
  {name: 'BNC Compras', image: 'bnc.jpg', matches: ['bnccompras', 'bnc.org.br']},
  {name: 'BR Conectado', image: 'brconectado.jpg', matches: ['brconectado']},
  {
    name: 'Compras.gov.br',
    image: 'comprasgov.jpg',
    matches: ['comprasgov', 'compras.gov.br', 'comprasnet', 'cnetmobile.estaleiro.serpro.gov.br']
  },
  {name: 'Compras MG', image: 'comprasmg.jpg', matches: ['comprasmg', 'compras.mg.gov.br']},
  {name: 'Fiorilli', image: 'fiorilli.png', matches: ['fiorilli']},
  {name: 'Licita Brasil', image: 'licitabrasil.jpg', matches: ['licitabrasil']},
  {name: 'Licitações-e', image: 'licitacoes-e.jpg', matches: ['licitacoes-e', 'licitacoese']},
  {name: 'LicitaCom', image: 'licitacom.jpg', matches: ['licitacom']},
  {name: 'Licitanet', image: 'licitanet.jpg', matches: ['licitanet']},
  {name: 'Licitar Digital', image: 'licitardigital.jpg', matches: ['licitardigital', 'licitar.digital']},
  {name: 'Portal de Compras Públicas', image: 'pcp.jpg', matches: ['portaldecompraspublicas', 'portalcompraspublicas']},
  {
    name: 'PROCERGS',
    image: 'procergs.png',
    matches: ['procergs', 'compras.rs.gov.br', 'pregaoonlinebanrisul.com.br', 'pregaobanrisul.com.br']
  }
];

export function getTenderOrigin(originUrl?: string | null): TenderOrigin | null {
  if (!originUrl) {
    return null;
  }

  const normalizedUrl = originUrl.toLowerCase();
  const origin = TENDER_ORIGINS.find((item) =>
    item.matches.some((match) => normalizedUrl.includes(match))
  );

  return origin
    ? {...origin, image: `assets/images/origins/${origin.image}`}
    : null;
}
