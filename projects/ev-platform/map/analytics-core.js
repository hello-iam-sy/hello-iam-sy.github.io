(function (root) {
  'use strict';
  const median = values => {
    const a = values.filter(Number.isFinite).sort((x, y) => x - y);
    if (!a.length) return null;
    const i = Math.floor(a.length / 2);
    return a.length % 2 ? a[i] : (a[i - 1] + a[i]) / 2;
  };
  function filter(rows, filters) {
    return rows.filter(r => (!filters.operator || r.operator_name === filters.operator)
      && (!filters.current || (['AC', 'DC'].includes(r.current_type) ? r.current_type : 'unknown') === filters.current)
      && (!filters.status || r.status === filters.status)
      && (!filters.region || r.sa4_code === filters.region));
  }
  function summarize(rows, area) {
    const prices = rows.map(r => r.price_per_kwh).filter(Number.isFinite);
    return {
      count: rows.length, sites: new Set(rows.map(r => r.location_id).filter(x => x != null)).size,
      ac: rows.filter(r => r.current_type === 'AC').length,
      dc: rows.filter(r => r.current_type === 'DC').length,
      unknown: rows.filter(r => !['AC', 'DC'].includes(r.current_type)).length,
      operators: new Set(rows.map(r => r.operator_name)).size,
      price: median(prices), priced: prices.length,
      power: median(rows.map(r => r.max_power_kw)),
      powerKnown: rows.filter(r => Number.isFinite(r.max_power_kw)).length,
      density: Number.isFinite(area) && area > 0 ? rows.length * 1000 / area : null,
    };
  }
  const api = {median, filter, summarize};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.EVAnalytics = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
