import React from 'react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'

import styles from "../../styles/Stat.module.css"; 

const Stat = () => {

  let date  = new Date();
  let year  = date.getFullYear();
  let month = date.getMonth();
  let day = date.getDate();

  const options = [
    {value: '', text: '--Выберите период--'},
    {value: 'День', text: 'День'},
    {value: 'Неделя', text: 'Неделя'},
    {value: 'Месяц', text: 'Месяц'},
    {value: 'Год', text: 'Год'}
  ];

  const [selected, setSelected] = useState(options[0].value);

  const [selectedDay_1, setSelectedDay_1] = useState(date.getDate());
  const [selectedMonth_1, setSelectedMonth_1] = useState(date.getMonth());
  const [selectedYear_1, setSelectedYear_1] = useState(date.getFullYear());
  const [selectedDay_2, setSelectedDay_2] = useState(date.getDate());
  const [selectedMonth_2, setSelectedMonth_2] = useState(date.getMonth());
  const [selectedYear_2, setSelectedYear_2] = useState(date.getFullYear()); 

  const [result, setResult] = useState('');

  const [listPurchases] = useState(() => {                  // массив для всех значений 
    const saved = localStorage.getItem('purchases');
    return saved ? JSON.parse(saved) : [];
  }); 

  // Получаем все даты текущей недели 
  function datesOfWeek(current) {
    let week = []; 
    // Начинаем с понедельника
    current.setDate((current.getDate() - current.getDay() +1)); // Текущий день месяца минус текущий день недели +1 
    for (let i = 0; i < 7; i++) {
        week.push(
            `${current.getDate()}-${current.getMonth()}-${current.getFullYear()}`
        ); 
        current.setDate(current.getDate() +1);
    }
    return week; 
  }

  // Получаем все даты текущего месяца 
  function datesOfMonth(current) {
    let month = []; 
    let daysInMonth = new Date(date.getFullYear(),date.getMonth() + 1,0).getDate(); // кол-во дней в текущем месяце

    for (let i = 1; i <= daysInMonth; i++) {
        month.push(
            `${i}-${current.getMonth()}-${current.getFullYear()}`
        ); 
    }
    return month; 
  }  

  // Получаем все даты текущего года 
  function datesOfYear(current) {
    let year = []; 

    for (let i = 0; i <= 11; i++) {
        let daysInMonth = new Date(date.getFullYear(), i + 1,0).getDate(); // кол-во дней по месяцам
      for (let k = 1; k <= daysInMonth; k++) {
        year.push(
            `${k}-${i}-${current.getFullYear()}`
        ); 
      }
    }
    return year; 
  }  

  const handleChange = (event) => {
    let sum = 0;
    if (event.target.value === "День") {
      let today = `${day}-${month}-${year}`
      let res = listPurchases.filter(item => item.date === today)
      for (let elem of res) {
        sum += +elem.costValue;
      }
      setSelected(event.target.value)
      setResult(sum)
    } else if (event.target.value === "Неделя") {
      let week = datesOfWeek(date)
      for (let elem of week) {
        let res = listPurchases.filter(item => item.date === elem)
        for (let elem of res) {
          sum += +elem.costValue;
        }
      }
      setSelected(event.target.value)
      setResult(sum)
    } else if (event.target.value === "Месяц") {
      let month = datesOfMonth(date)
      for (let elem of month) {
        let res = listPurchases.filter(item => item.date === elem)
        for (let elem of res) {
          sum += +elem.costValue;
        }
      }
      setSelected(event.target.value)
      setResult(sum)
    } else if (event.target.value === "Год") {
      let year = datesOfYear(date)
      for (let elem of year) {
        let res = listPurchases.filter(item => item.date === elem)
        for (let elem of res) {
          sum += +elem.costValue;
        }
      }
      setSelected(event.target.value)
      setResult(sum)
    }
  };

  
  // Делаем выбор опред. отрезка времени // 

  // Функция по нахождению кол-ва дней в месяце
  const daysInMonth = (month) => {
    let daysInMonth = new Date(date.getFullYear(), +month + 1, 0).getDate(); // кол-во дней в месяце 
    let arr = [];
    for (let i = 1; i <= daysInMonth; i++){
      arr.push(i)
    } 
    return arr   
  }


  const monthOptions = [
    {value: '0', text: 'января'},
    {value: '1', text: 'февраля'},
    {value: '2', text: 'марта'},
    {value: '3', text: 'апреля'},
    {value: '4', text: 'мая'},
    {value: '5', text: 'июня'},
    {value: '6', text: 'июля'},
    {value: '7', text: 'августа'},
    {value: '8', text: 'сентября'},
    {value: '9', text: 'октября'},
    {value: '10', text: 'ноября'},
    {value: '11', text: 'декабря'}
  ];

  const yearOptions = [
    {value: '2020', text: '2020'},
    {value: '2021', text: '2021'},
    {value: '2022', text: '2022'},
    {value: '2023', text: '2023'},
    {value: '2024', text: '2024'},
    {value: '2025', text: '2025'},
    {value: '2026', text: '2026'},
    {value: '2027', text: '2027'},
    {value: '2028', text: '2028'},
    {value: '2029', text: '2029'},
    {value: '2030', text: '2030'}
  ];


  /* Определение дней из выбранного отрезка */
  const d1 = new Date(`${selectedYear_1}-${+selectedMonth_1 + 1}-${selectedDay_1}`);
  const d2 = new Date(`${selectedYear_2}-${+selectedMonth_2 + 1}-${selectedDay_2}`);

  function getDatesInRange(startDate, endDate) {
    const date = new Date(startDate.getTime());

    const dates = [];

    while (date <= endDate) {
      dates.push(`${new Date(date).getDate()}-${new Date(date).getMonth()}-${new Date(date).getFullYear()}`);
      date.setDate(date.getDate() + 1);
    }
    return dates;
  }

  function summary(){
    let choosedDates = getDatesInRange(d1, d2);
    let sum = 0;
    for (let elem of choosedDates) {
      let res = listPurchases.filter(item => item.date === elem)
      for (let elem of res) {
        sum += +elem.costValue
      }
      setResult(sum)
    }    
  }


  return <>
          <div>
            <button>
                <NavLink to="/">На главную</NavLink>
            </button>
            <h2>Статистика</h2>
            <div className={styles.content}>
              <div>
                <label>
                  <select 
                      value={selected} 
                      onChange={handleChange}
                  >
                        {options.map(option => (
                          <option key={option.value} value={option.value} >
                            {option.text}
                          </option>
                        ))}
                  </select>
                </label>
              </div>

              <div>
                <div className={styles.title}>Выберите период</div>        
                <div className={styles.selects}>
                  <div className={styles.selects_text}> От: </div>
                  <label>
                    <select 
                        defaultValue={date.getDate()} 
                        onChange={e => setSelectedDay_1(e.target.value)}
                    >
                      {daysInMonth(date.getMonth()).map(i => (
                        <option key={i} value={i}>
                          {i}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <select 
                        defaultValue={date.getMonth()}
                        onChange={e => setSelectedMonth_1(e.target.value)}
                    >
                      {monthOptions.map(month => (
                        <option key={month.value} value={month.value}>
                          {month.text}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <select 
                        defaultValue={date.getFullYear()}
                        onChange={e => setSelectedYear_1(e.target.value)}
                    >
                      {yearOptions.map(year => (
                        <option key={year.value} value={year.value}>
                          {year.text}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className={styles.selects}>
                  <div className={styles.selects_text}>До:</div>
                  <label>
                    <select 
                        defaultValue={date.getDate()} 
                        onChange={e => setSelectedDay_2(e.target.value)}
                    >
                      {daysInMonth(date.getMonth()).map(i => (
                        <option key={i} value={i}>
                          {i}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <select 
                        defaultValue={date.getMonth()}
                        onChange={e => setSelectedMonth_2(e.target.value)}
                    >
                      {monthOptions.map(month => (
                        <option key={month.value} value={month.value}>
                          {month.text}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <select 
                        defaultValue={date.getFullYear()} 
                        onChange={e => setSelectedYear_2(e.target.value)}
                    >
                      {yearOptions.map(year => (
                        <option key={year.value} value={year.value}>
                          {year.text}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <button 
                  onClick={summary}
                >
                  Высчитать
                </button>                

              </div>  
            </div>

            <hr/>

            <div>
                Рез-т: {result} 
            </div>

          </div>
        </>
}

export default Stat