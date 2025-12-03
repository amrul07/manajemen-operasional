import React, { useEffect, useState } from 'react';
import { deleteData, fetchData, postData } from '../../../api/api';
import useGlobalStore from '../../../store/globalStore';

export default function UserLogic() {
  const [data, setData] = useState([]); // data user
  const searchQuery = useGlobalStore((state) => state.searchQuery);
  const setSearchQuery = useGlobalStore((state) => state.setSearchQuery);
  const [itemsPerPage, setItemsPerPage] = useState(10); // items perpage
  const [page, setPage] = useState(1); // page
  const [totalPages, setTotalPages] = useState(0); // total pages
  const [totalItems, setTotalItems] = useState(0); // total items
  const [newData, setNewData] = useState({
    name: '', // nama
    noHp: '', // nomor hp
    jabatan: '', // jabatan
    password: '' // password
  });
  const [modal, setModal] = useState({
    data: false, // modal add / edit data
    delete: false, // modal delete data
    succes: false // modal yang muncul setelah add / edit data
  });
  const [deleteId, setDeleteId] = useState(null); // delete data berdasarkan id
  const [editingId, setEditingId] = useState(null); // edit data berdasarkan id
  const [editMode, setEditMode] = useState(false); // edit mode
  const [showPassword, setShowPassword] = useState(false); // lihat password
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: ''
  }); // pesan error
  const [loading, setLoading] = useState(false);
  const [loadingGet, setLoadingGet] = useState(true); // loading get data
  const [loadingPagination, setLoadingPagination] = useState(false);

  useEffect(() => {
    getData();
  }, [itemsPerPage, page, searchQuery]);

  // get data
  const getData = async () => {
    try {
      setLoadingPagination(true);
      const res = await fetchData(`/admin/users?perpage=${itemsPerPage}&page=${page}&search=${searchQuery}`);

      setData(res.data);
      setPage(res.meta.page);
      setTotalPages(res.meta.total_page);
      setTotalItems(res.meta.total_item);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingGet(false);
      setLoadingPagination(false);
    }
  };

  //   modal add / edit open
  const handleModal = () => {
    setModal((prev) => ({ ...prev, data: true }));
  };

  //   modal delete
  const openModalDelete = (id) => {
    setModal((prev) => ({ ...prev, delete: true }));
    setDeleteId(id);
  };

  // close modal
  const handleCloseModal = () => {
    setModal({ data: false, delete: false, succes: false });
    setEditMode(false);
    setEditingId(null);
    setNewData((prev) => ({ ...prev, name: '', noHp: '', jabatan: '' }));
  };

  // ketika tombol edit di klik
  const handleEdit = (id) => {
    setEditingId(id);
    const selectedItem = data.find((item) => item.id === id);
    if (!selectedItem) return;
    setNewData({
      name: selectedItem?.name || '',
      noHp: selectedItem?.no_hp || '',
      jabatan: selectedItem?.jabatan || '',
      password: ''
    });
    setModal((prev) => ({ ...prev, data: true }));
    setEditMode(true);
  };

  //   handle change
  const handleChange = (e) => {
    setNewData({
      ...newData,
      [e.target.name]: e.target.value
    });
  };

  //   handle change jabatan
  const handleChangeJabatan = (event, newValue) => {
    setNewData((prev) => ({
      ...prev,
      jabatan: newValue ?? ''
    }));
  };

  // snackbar
  // handle close snackbar
  const closeSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ open: false, message: '' });
  };

  // lihat password
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // page
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeItemsPerPage = (value) => {
    setItemsPerPage(value);
    setPage(page); // reset ke page 1
  };

  //   fungsi tambah atau edit data
  const handleSave = () => {
    setLoading(true);
    // edit data
    if (editMode) {
      const formData = new FormData();
      formData.append('name', newData.name);
      formData.append('no_hp', newData.noHp);
      formData.append('jabatan', newData.jabatan);
      formData.append('_method', 'PUT');
      postData(`/admin/users/${editingId}`, formData)
        .then((res) => {
          const updateData = data.map((item) => (item.id === editingId ? res : item));
          //   setData(updateData);
          getData();
          setModal((prev) => ({ ...prev, succes: true }));
        })
        .catch((error) => {
          console.error('Gagal mengedit data:', error);
          // Mengambil pesan error dari respons
          let pesanError = 'Terjadi kesalahan saat mengedit data';

          if (error.response) {
            pesanError = error?.response?.data?.message || error?.message || 'Terjadi kesalahan';
          }

          setSnackbar({
            open: true,
            message: pesanError
          });
        })
        .finally(() => {
          setEditMode(false);
          setEditingId(null);
          setNewData({
            name: '',
            noHp: '',
            jabatan: '',
            password: ''
          });
          setModal((prev) => ({ ...prev, data: false }));
          setLoading(false);
        });
    } else {
      // tambah data
      const formDataPost = new FormData();
      formDataPost.append('name', newData.name);
      formDataPost.append('no_hp', newData.noHp);
      formDataPost.append('jabatan', newData.jabatan);
      formDataPost.append('password', newData.password);
      postData(`/admin/users`, formDataPost)
        .then((res) => {
          //   setData([...data, res]);
          getData();
          setModal((prev) => ({ ...prev, succes: true }));
        })
        .catch((error) => {
          console.error('Gagal menambahkan data:', error);
          let pesanError = 'Terjadi kesalahan saat menambah data';

          if (error.response) {
            pesanError = error?.response?.data?.message || error?.message || 'Terjadi kesalahan';
          }

          setSnackbar({
            open: true,
            message: pesanError
          });
        })
        .finally(() => {
          setNewData({ name: '', noHp: '', jabatan: '', password: '' });
          setModal((prev) => ({ ...prev, data: false }));
          setLoading(false);
        });
    }
  };

  //   fungsi hapus data
  const handleDelete = () => {
    setLoading(true);
    deleteData(`/admin/users/${deleteId}`)
      .then((res) => {
        const deleteData = data.filter((item) => item.id !== deleteId);
        // setData(deleteData);
        getData();
      })
      .catch((error) => {
        console.error('Gagal menghapus data:', error);
        // Mengambil pesan error dari respons
        let pesanError = 'Terjadi kesalahan saat menghapus data';

        if (error.response) {
          pesanError = error?.response?.data?.message || error?.message || 'Terjadi kesalahan';
        }

        setSnackbar({
          open: true,
          message: pesanError
        });
      })
      .finally(() => {
        setDeleteId(null);
        setModal((prev) => ({ ...prev, delete: false }));
        setLoading(false);
      });
  };

  return {
    value: {
      data,
      itemsPerPage,
      page,
      totalPages,
      totalItems,
      // searchQuery,
      // setSearchQuery,
      newData,
      setNewData,
      modal,
      deleteId,
      editMode,
      editingId,
      showPassword,
      snackbar,
      loading,
      loadingGet,
      loadingPagination
    },
    func: {
      handleChange,
      handleChangeJabatan,
      handleModal,
      handleCloseModal,
      openModalDelete,
      handleEdit,
      closeSnackbar,
      handleShowPassword,
      handleMouseDownPassword,
      handleChangePage,
      handleChangeItemsPerPage,
      handleSave,
      handleDelete
    }
  };
}
