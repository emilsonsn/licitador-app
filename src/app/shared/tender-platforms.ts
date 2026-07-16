export interface TenderPlatformOption {
  value: string;
  label: string;
}

function urlPrefixes(...domains: string[]): string {
  return domains
    .flatMap((domain) => [`https://${domain}`, `http://${domain}`])
    .join(',');
}

export const TENDER_PLATFORM_OPTIONS: TenderPlatformOption[] = [
  {label: 'BBMNET', value: urlPrefixes('bbmnetlicitacoes.com.br', 'www.bbmnetlicitacoes.com.br', 'bbmnet.com.br')},
  {label: 'BLL Compras', value: urlPrefixes('bllcompras.com', 'www.bllcompras.com', 'bll.org.br', 'www.bll.org.br')},
  {label: 'BNC Compras', value: urlPrefixes('bnccompras.com', 'www.bnccompras.com', 'bnc.org.br', 'www.bnc.org.br')},
  {label: 'BR Conectado', value: urlPrefixes('brconectado.com.br', 'www.brconectado.com.br')},
  {
    label: 'Compras.gov.br / Comprasnet',
    value: urlPrefixes(
      'cnetmobile.estaleiro.serpro.gov.br',
      'comprasnet.gov.br',
      'www.comprasnet.gov.br',
      'comprasgovernamentais.gov.br',
      'www.comprasgovernamentais.gov.br'
    )
  },
  {label: 'Compras MG', value: urlPrefixes('compras.mg.gov.br', 'www1.compras.mg.gov.br')},
  {label: 'Fiorilli', value: urlPrefixes('fiorilli.com.br', 'www.fiorilli.com.br')},
  {label: 'Licita Brasil', value: urlPrefixes('licitabrasil.com.br', 'www.licitabrasil.com.br')},
  {
    label: 'Licitações-e',
    value: urlPrefixes('licitacoes-e.com.br', 'www.licitacoes-e.com.br', 'licitacoes-e2.bb.com.br')
  },
  {label: 'LicitaCom', value: urlPrefixes('licitacom.com.br', 'www.licitacom.com.br')},
  {
    label: 'Licitanet',
    value: urlPrefixes('licitanet.com.br', 'www.licitanet.com.br', 'portal.licitanet.com.br')
  },
  {
    label: 'Licitar Digital',
    value: urlPrefixes('licitardigital.com.br', 'www.licitardigital.com.br', 'app.licitardigital.com.br', 'app2.licitardigital.com.br')
  },
  {
    label: 'Portal de Compras Públicas',
    value: urlPrefixes('portaldecompraspublicas.com.br', 'www.portaldecompraspublicas.com.br')
  },
  {
    label: 'PROCERGS / Compras RS',
    value: urlPrefixes(
      'procergs.rs.gov.br',
      'www.procergs.rs.gov.br',
      'compras.rs.gov.br',
      'www.compras.rs.gov.br',
      'pregaoonlinebanrisul.com.br',
      'www.pregaoonlinebanrisul.com.br',
      'pregaobanrisul.com.br'
    )
  }
];
