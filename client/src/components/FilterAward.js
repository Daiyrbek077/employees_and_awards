// FilterAward.jsx

import React, { useContext } from 'react';
import { Dropdown } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import { Context } from '../index';
import { IoFilter } from "react-icons/io5";

const FilterAward = observer(() => {
    const { employee } = useContext(Context);


    return (
        <Dropdown className="mb-3">
            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
            <IoFilter fontSize="25px" /> {employee.selectedAward ? employee.selectedAward.title : "Все награды"}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item onClick={() => employee.setSelectedAward(null)}>Все награды</Dropdown.Item>
                {employee.awards.map((award) => (
                    <Dropdown.Item key={award.id} onClick={() => employee.setSelectedAward(award)}>
                        {award.title}
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
});

export default FilterAward;
