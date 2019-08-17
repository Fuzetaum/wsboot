const paginatedResponse = (data, currentPage, pageSize) => {
  if (typeof data === 'object') {
    const lastPage = Math.ceil(Object.keys(data).length / pageSize);
    if (currentPage > lastPage) {
      return {
        pages: lastPage,
        currentPage,
        pageSize,
        data: Object.keys(data).slice((lastPage - 1) * pageSize)
        .map(dataItemKey => ({ id: dataItemKey, ...data[dataItemKey], })),
      };
    } else {
      return {
        pages: lastPage,
        currentPage,
        pageSize,
        data: Object.keys(data).slice((lastPage - 1) * pageSize, lastPage * pageSize)
        .map(dataItemKey => ({ id: dataItemKey, ...data[dataItemKey], })),
      };
    }
  } else {
    const lastPage = Math.ceil(data.length / pageSize);
    if (currentPage > lastPage) {
      return {
        pages: lastPage,
        currentPage,
        pageSize,
        data: data.slice((lastPage - 1) * pageSize),
      };
    } else {
      return {
        pages: lastPage,
        currentPage,
        pageSize,
        data: data.slice((lastPage - 1) * pageSize, lastPage * pageSize),
      };
    }
  }
};

const paginated = (req, res, pageSize) => ({
  ...res,
  send: (data) => res.send(paginatedResponse(data, req.query.page || 1, pageSize)),
  json: (data) => res.json(paginatedResponse(data, req.query.page || 1, pageSize)),
});

module.exports = {
  paginated,
};
