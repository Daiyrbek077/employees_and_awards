import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { Context } from '..';
import { fetchAwards, deleteAward } from '../http/employeeApi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdDeleteOutline, MdOutlineModeEditOutline } from "react-icons/md";
import EditAwards from './modals/EditAwards';

const Awards = observer(({ search }) => {
  const { employee, user } = useContext(Context);
  const [editAward, setEditAward] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchAwards().then(data => employee.setAwards(data));
  }, [employee]);

  const handleDeleteClick = (award) => {
    if (window.confirm(`Вы уверены, что хотите удалить награду: ${award.title}?`)) {
      deleteAward(award.id)
        .then(() => {
          toast.success(`Награда: ${award.title} удалена`);
          fetchAwards().then(data => employee.setAwards(data));
        })
        .catch((error) => {
          toast.error(`Ошибка при удалении награды: ${error.message}`);
        });
    }
  };

  const handleEditClick = (award) => {
    toast.info(`Редактирование награды: ${award.title}`);
    setTitle(award.title);
    setDescription(award.description);
    setFile(award.img);
    setEditId(award.id);
    setEditAward(true);
  };

  if (employee.awards.length === 0) {
    return <h1>Ничего не найдено</h1>;
  }

  return (
    <>
      <ToastContainer />
      <h1>Награды</h1>
      <hr className="mb-5" />
      {employee.awards
        .filter(award => {
          return search.toLowerCase() === ''
            ? award
            : award.title.toLowerCase().includes(search.toLowerCase());
        })
        .map(award => (
          <div key={award.id} className="d-flex">
            <div className="mb-5 border-bottom" style={{ minHeight: "240px" }}>
              <img
                style={{ float: "left", border: "3px solid grey", marginRight: "30px", marginBottom: "20px" }}
                src={process.env.REACT_APP_API_URL + award.img}
                alt=""
                height="200px"
              />
              <h3 className="text-center mb-3">{award.title}</h3>
              <p>{award.description}</p>
            </div>
            {user.edit && (
              <div className="d-flex align-items-start">
                <div style={{
                  height: "30px",
                  width: "30px",
                  background: "#8B0000",
                  marginTop: "10px",
                  marginRight: "5px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "5px"
                }}>
                  <MdDeleteOutline
                    onClick={() => handleDeleteClick(award)}
                    style={{
                      fontSize: "20px",
                      color: "white"
                    }}
                  />
                </div>
                <div style={{
                  height: "30px",
                  width: "30px",
                  background: "#008B8B",
                  marginTop: "10px",
                  marginRight: "5px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "5px"
                }}>
                  <MdOutlineModeEditOutline
                    onClick={() => handleEditClick(award)}
                    style={{
                      fontSize: "20px",
                      color: "white"
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      <EditAwards
        show={editAward}
        onHide={() => setEditAward(false)}
        titleT={title}
        descriptionA={description}
        fileA={file}
        id={editId}
      />
    </>
  );
});

export default Awards;
