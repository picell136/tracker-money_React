import { useState } from 'react'
// import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'

import styles from "../../styles/Home.module.css"; 

import rightArrow from '../../images/arrow-circle-right.svg'
import leftArrow from '../../images/arrow-circle-left.svg'

const Home = () => {

    let date  = new Date();
    let year  = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();

    const [displayDay, setDisplayDay] = useState(day);
    const [displayMonth, setDisplayMonth] = useState(month);
    const [displayYear, setDisplayYear] = useState(year);

    function prevDay() {
        if (displayDay === 1) {
            if (displayMonth === 0) {
                setDisplayYear(displayYear - 1)
                setDisplayMonth(11)
                setDisplayDay(getLastDayofMonth()) 
            } else {
                setDisplayMonth(displayMonth - 1)
                setDisplayDay(getLastDayofMonth())                
            }               
        } else {
            setDisplayDay(displayDay - 1) 
        }
    }

    function nextDay() {
        let date = new Date(displayYear, displayMonth, displayDay); // выясняем дату показанную на экране
        let lastDay = new Date(displayYear, displayMonth + 1, -1);  // посл. день след. месяца даты, показанной на экране

        if (date.getDate() == lastDay.getDate() + 1) { // если дата на экране равна последнему дню месяца, то идёт переход на 1е число след. месяца
            setDisplayDay(1)
            setDisplayMonth(displayMonth + 1)
            if (displayMonth === 11){
                setDisplayMonth(0)
                setDisplayYear(displayYear + 1)
            }
        } else {
            setDisplayDay(displayDay + 1)  
        }
    }


    // последний день месяца
    function getLastDayofMonth(){
        let date = new Date(displayYear, displayMonth, 0);
        return date.getDate()
    }

    function convertMonths(displayMonth){
        let months = [  'января', 'февраля', 'марта', 'апреля', 
                        'мая', 'июня', 'июля', 'августа', 
                        'сентября', 'октября', 'ноября', 'декабря']
        return months[displayMonth]
    }


    const [name, setName] = useState('')
    const [category, setCategory] = useState('')
    const [cost, setCost] = useState('')

    const [listPurchases, setListPurchases] = useState(() => {                  // массив для всех значений за один день
        const saved = localStorage.getItem('purchases');
        return saved ? JSON.parse(saved) : [];
      }); 

    const [listCategories] = useState(() => {                  // массив для всех значений за один день
        const saved = localStorage.getItem('categories');
        return saved ? JSON.parse(saved) : [];
      });   

    const onNameChanged = (e) => setName(e.target.value)
    const onCategoryChanged = (e) => setCategory(e.target.value)
    const onCostChanged = (e) => setCost(e.target.value)

    const onSavePurchaseClick = () => {
        let date = new Date();

        let noteDate = `${displayDay}-${displayMonth}-${displayYear}`

        const updatedList = [  ...listPurchases, 
                                {   purchaseName: name, 
                                    categoriesName: category,
                                    costValue: cost,
                                    date: noteDate,
                                    creationTime: date.getTime(), 
                                    isEdit: false 
                                }
                            ]
        setListPurchases(updatedList);
        localStorage.setItem(`purchases`, JSON.stringify(updatedList));
    }

    const categoriesList = () => {
        if (listCategories.length > 0){     // Проверка, что categories - это массив
            return listCategories.map((category, i) => 
                <option key={i} value={category.categoriesName}>
                    {category.categoriesName}
                </option>
        )
        } else {
            return null
        }
    }

    // Функция переключения isEdit
    const toggleIsEdit = (creationTime) => {

        let input = document.getElementById(creationTime)

        // Создаем новый массив, обновляя только нужный элемент
        const updatedList = listPurchases.map(purchase => {
            if (purchase.creationTime === creationTime) {

                input.value = purchase.value // в инпут попадает значение текста

                return { ...purchase, isEdit: !purchase.isEdit };  
            }   
            return purchase;
        });
        //Обновляем состояние и передаем в localStorage
        setListPurchases(updatedList);
        localStorage.setItem(`purchases`, JSON.stringify(updatedList));
    }

    // Функция для обновления значения заметки при редактировании
    const handleEditChange_1 = (creationTime, newValue) => {
        const updatedList = listPurchases.map(purchase => {
            if (purchase.creationTime === creationTime) {
                return { ...purchase, purchaseName: newValue };
            }
            return purchase;
        });
        setListPurchases(updatedList);
        localStorage.setItem('purchases', JSON.stringify(updatedList));
    };

    const handleEditChange_2 = (creationTime, newValue) => {
        console.log(newValue);
        const updatedList = listPurchases.map(purchase => {
            if (purchase.creationTime === creationTime) {
                return { ...purchase, categoriesName: newValue };
            }
            return purchase;
        });
        setListPurchases(updatedList);
        localStorage.setItem('purchases', JSON.stringify(updatedList));
    };


    // Функция для обновления значения заметки при редактировании
    const handleEditChange_3 = (creationTime, newValue) => {
        const updatedList = listPurchases.map(purchase => {
            if (purchase.creationTime === creationTime) {
                return { ...purchase, costValue: newValue };
            }
            return purchase;
        });
        setListPurchases(updatedList);
        localStorage.setItem('purchases', JSON.stringify(updatedList));
    };

    // Функция удаления заметки
    const deletePurchase = (creationTime) => {
        const updatedList = listPurchases.filter(purchase => purchase.creationTime !== creationTime);    // Метод filter перебирает массив list и применяет функцию к каждому элементу. 
        setListPurchases(updatedList);                                                           // Он возвращает только заметки, идентификаторы которых не совпадают с указанным идентификатором creationTime, фактически удалив выбранную заметку. 
        localStorage.setItem('purchases', JSON.stringify(updatedList));
    };

    // Фильтруем по дате
    let filtered = listPurchases.filter(purchase => purchase.date === `${displayDay}-${displayMonth}-${displayYear}`);
    
    let createTable = () => filtered.length === 0 ?
                        null :
                        <table className={styles["border-none"]}>
                            <thead>
                                <tr>
                                    <th>Название</th>
                                    <th>Категория</th>
                                    <th>Стоимость</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listOfPurchases()}
                            </tbody>
                        </table>      

    let listOfPurchases = () => filtered.length === 0 ? 
                            null : 
                            filtered.map((elem, i) => { 
                                return  <tr key={i}>
                                            <td>
                                                 {!elem.isEdit ? 
                                                    <span    
                                                        style={{
                                                            visibility: !elem.isEdit ? 'visible' : 'hidden'
                                                            }}
                                                    > 
                                                        {elem.purchaseName}
                                                    </span>
                                                 :
                                                    <input
                                                        className={styles.purchase}
                                                        id={elem.creationTime}  // Генерируем для каждого инпута свой id
                                                        style={{
                                                            visibility: elem.isEdit ? 'visible' : 'hidden'
                                                        }}
                                                        value={elem.purchaseName}
                                                        onChange={(e) => handleEditChange_1(elem.creationTime, e.target.value)} // Функция срабатывающая каждый раз при новом значении
                                                    />
                                                 }   
                                            </td>
                                            <td>
                                                {!elem.isEdit ? 
                                                    <span
                                                    className={styles.category}
                                                    style={{
                                                        visibility: !elem.isEdit ? 'visible' : 'hidden'
                                                        }}
                                                    >
                                                    {elem.categoriesName}
                                                    </span>
                                                :
                                                    <select 
                                                        value={elem.categoriesName} 
                                                        onChange={(e) => handleEditChange_2(elem.creationTime, e.target.value)}
                                                        style={{
                                                            visibility: elem.isEdit ? 'visible' : 'hidden'
                                                            }}    
                                                    >
                                                        {listCategories.map((option, i) => (
                                                            <option key={i} value={option.categoriesName}>
                                                                {option.categoriesName}
                                                            </option>
                                                        ))}
                                                    </select>
                                                }
                                            </td>
                                            <td>
                                                <span    
                                                    className={styles.cost}
                                                    style={{
                                                        visibility: !elem.isEdit ? 'visible' : 'hidden'
                                                        }}
                                                > 
                                                    {elem.costValue} ₽
                                                </span>
                                                <input
                                                    id={elem.creationTime}  // Генерируем для каждого инпута свой id
                                                    style={{
                                                        visibility: elem.isEdit ? 'visible' : 'hidden'
                                                    }}
                                                    value={elem.costValue}
                                                    onChange={(e) => handleEditChange_3(elem.creationTime, e.target.value)} // Функция срабатывающая каждый раз при новом значении
                                                />
                                            </td>
                                            <td
                                                className={styles.edit}
                                                onClick={() => toggleIsEdit(elem.creationTime)} 
                                            >    
                                                {elem.isEdit ? 'Сохранить' : 'Редактировать'}
                                            </td>
                                            <td 
                                                className={styles.delete}
                                                onClick={() => deletePurchase(elem.creationTime)}
                                            >
                                                Удалить
                                            </td>
                                        </tr>
                            })
    

    return <>
            <div>
                <div className={styles.navigation}>
                    <span className={styles["icon-arrow"]} onClick={prevDay}>
                        <img src={leftArrow} alt="Arrow circle icon" width="50" height="50"/>
                    </span>
                    <div className={styles.date}> {displayDay} {convertMonths(displayMonth)} {displayYear} года </div>
                    <span className={styles["icon-arrow"]} onClick={nextDay}>
                        <img src={rightArrow} alt="Arrow circle icon" width="50" height="50"/>
                    </span>
                </div>

                <div className={styles.buttons} >  
                    <div className={styles.buttons2}>      
                        <button>
                            <NavLink to="/categories">Категории</NavLink>
                        </button>

                        <button>
                            <NavLink to="/stat">Статистика</NavLink>
                        </button>
                    </div>  
                </div>  

                <div className={styles.title}>Добавить покупку</div>
                <div className={styles.inputsAndSelect}>                    
                        <input
                            id="purchaseName"
                            name="purchasetName"
                            placeholder='Название'
                            value={name}
                            onChange={onNameChanged}
                        />

                        <select id="category" value={category} onChange={onCategoryChanged}>
                            <option value=""> - Выберите категорию - </option>
                            {categoriesList()}
                        </select>

                    <input
                        id="costValue"
                        name="costValue"
                        placeholder='Стоимость'
                        value={cost}
                        onChange={onCostChanged}
                    />

                    <button type="button" onClick={onSavePurchaseClick}>
                        Добавить
                    </button>
                </div>
                <div>
                </div>
                <div className={styles.table}>
                        {createTable()}
                </div>
            </div>
        </>
}

export default Home