import React, { useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import { parse } from 'json2csv';

const Timestamp = () => {
  const [data, setData] = useState([]);
  const baseUrl = process.env.REACT_APP_URL;

  useEffect(() => {
    fetch(`${baseUrl}/get-timestamp`)
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, [baseUrl]);

  const convertToCSV = (data) => {
    const csvData = [];

    for (const mobile in data) {
      const { number, timestamps } = data[mobile];
      timestamps.forEach(({ date, timestamps }) => {
        csvData.push({
          'Mobile Number': number,
          'Date': date,
          'Timestamps': timestamps.join('|')
        });
      });
    }

    return parse(csvData);
  };

  const downloadCSV = () => {
    const csvData = convertToCSV(data);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'timestamps.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div>
      <Button 
      variant="contained" 
      color="primary"
       onClick={downloadCSV}
       size="small"

       >
        Download CSV
      </Button>
    </div>
  );
};

export default Timestamp;
