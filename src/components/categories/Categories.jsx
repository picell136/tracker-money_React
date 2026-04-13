import React from 'react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'

import styles from "../../styles/Categories.module.css"; 

const Categories = () => {
    const [name, setName] = useState('')
    const [listCategories, setListCategories] = useState(() => {                  // получаем массив значений
        const saved = localStorage.getItem('categories');
        return saved ? JSON.parse(saved) : [];
        }); 

    const onSaveCategoryClick = () => {
        let date = new Date();

        const updatedList = [  ...listCategories, 
                                {   categoriesName: name,
                                    creationTime: date.getTime(), 
                                    isEdit: false 
                                }
                            ]
        setListCategories(updatedList);
        localStorage.setItem(`categories`, JSON.stringify(updatedList));
    }

    const onNameChanged = (e) => setName(e.target.value)

    // Функция для обновления значения заметки при редактировании
    const handleEditChange = (creationTime, newValue) => {
        const updatedList = listCategories.map(category => {
            if (category.creationTime === creationTime) {
                return { ...category, categoriesName: newValue };
            }
            return category;
        });
        setListCategories(updatedList);
        localStorage.setItem('categories', JSON.stringify(updatedList));
    };

    const toggleIsEdit = (creationTime) => {
        // Создаем новый массив, обновляя только нужный элемент
        const updatedList = listCategories.map(category => {
            if (category.creationTime === creationTime) {
                return { ...category, isEdit: !category.isEdit };  
            }   
            return category;
        });
        //Обновляем состояние и передаем в localStorage
        setListCategories(updatedList);
        localStorage.setItem(`categories`, JSON.stringify(updatedList));
    }

    // Функция удаления заметки
    const deleteCategory = (creationTime) => {
        const updatedList = listCategories.filter(category => category.creationTime !== creationTime);    // Метод filter перебирает массив list и применяет функцию к каждому элементу. 
        setListCategories(updatedList);                                                           // Он возвращает только заметки, идентификаторы которых не совпадают с указанным идентификатором creationTime, фактически удалив выбранную заметку. 
        localStorage.setItem('categories', JSON.stringify(updatedList));
    };

    const listOfCategories = () => {
        if (listCategories.length > 0){     // Проверка, что categories - это массив
            return listCategories.map((category, i) => 
                <tr key={i}>
                    <td>
                        {!category.isEdit ?  
                            <span    
                                style={{
                                    visibility: !category.isEdit ? 'visible' : 'hidden'
                                    }}
                            > 
                                {category.categoriesName}
                            </span>                        
                          :
                            <input
                                style={{
                                    visibility: category.isEdit ? 'visible' : 'hidden'
                                }}
                                value={category.categoriesName}
                                onChange={(e) => handleEditChange(category.creationTime, e.target.value)} // Функция срабатывающая каждый раз при новом значении
                            />                        
                        }
                    </td>
                    <td className={styles.firstButton} onClick={() => toggleIsEdit(category.creationTime)} >
                        {category.isEdit ? 'Сохранить' : 'Редактировать'}
                    </td>
                    <td className={styles.secondButton} onClick={() => deleteCategory(category.creationTime)}>
                        Удалить
                    </td>
                </tr>
        )
        } else {
            return 
        }
    }

    return <><div>
                <button>
                    <NavLink to="/">На главную</NavLink>
                </button>
                <h2>Категории</h2>

                <div className={styles.title}>Добавить категорию</div>
                <div className={styles.inputButton}>
                    <div className={styles.inputButton2}>
                        <input
                            id="categoryName"
                            name="categoryName"
                            value={name}
                            onChange={onNameChanged}
                        />

                        <button type="button" onClick={onSaveCategoryClick}>
                            Сохранить
                        </button>
                    </div>
                </div>

                <div className={styles.table}>
                    <table className={styles["border-none"]}>
                        <thead>
                            <tr>
                                <th>Название категории</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listOfCategories()}
                        </tbody>
                    </table>
                </div>
            </div>
            </>
}

export default Categories