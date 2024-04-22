 const processData = (data) => {
    const pollutants = {};
    Object.values(data).forEach(sites => {
      Object.values(sites).forEach(pollutantsData => {
        Object.entries(pollutantsData).forEach(([pollutant, values]) => {
          values.forEach(record => {
            const value = record[1];
            if (value && !isNaN(value)) {
              if (!pollutants[pollutant]) {
                pollutants[pollutant] = { sum: 0, count: 0 };
              }
              pollutants[pollutant].sum += parseFloat(value);
              pollutants[pollutant].count++; 
            }
          });
        });
      });
    });
    
    const averages = Object.fromEntries(
      Object.entries(pollutants).map(([pollutant, { sum, count }]) => [
        pollutant,
        count > 0 ? sum / count : null,
      ])
    );
    console.log(pollutants)
    return averages;
  };



  
export default processData;

  