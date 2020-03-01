export function PMT(rate: number, nperiod: number, pv: number) {
  if (rate === 0) return -pv / nperiod;

  var pvif = Math.pow(1 + rate, nperiod);
  var pmt = (rate / (pvif - 1)) * -(pv * pvif);

  return pmt;
}

export function IPMT(pv: number, pmt: number, rate: number, per: number) {
  var tmp = Math.pow(1 + rate, per - 1);
  return 0 - (pv * tmp * rate + pmt * (tmp - 1));
}

export function PPMT(rate: number, per: number, nper: number, pv: number) {
  var pmt = PMT(rate, nper, pv);
  var ipmt = IPMT(pv, pmt, rate, per);
  return pmt - ipmt;
}
