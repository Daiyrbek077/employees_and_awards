import React, { useContext } from 'react';
import { Dropdown } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import { Context } from '../index';
import { IoFilter } from "react-icons/io5";

const FilterSubdivisions = observer(() => {
    const { employee } = useContext(Context);

    return (
        <Dropdown className="mb-3">
            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                <IoFilter fontSize="25px" /> {employee.selectedSub ? employee.selectedSub.title : "Все подразделения"}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item onClick={() => employee.setSelectedSub(null)}>Все подразделения</Dropdown.Item>
                {employee.subdivisions.map((subdivision) => (
                    <Dropdown.Item key={subdivision.id} onClick={() => employee.setSelectedSub(subdivision)}>
                        {subdivision.title}
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
});

export default FilterSubdivisions;
