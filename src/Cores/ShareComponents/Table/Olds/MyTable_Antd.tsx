// import React, { Fragment } from 'react';
// import { Table, Input, Button, Space } from 'antd';
// import Highlighter from 'react-highlight-words';
// import { SearchOutlined } from '@ant-design/icons';

// //Constants
// import { DataTypeConst } from 'src/Cores/Constants';

// //Utils
// import { CommonUtil } from '../Helpers';

// class MyTable extends React.Component {
//     constructor(props) {
//         super(props);

//         this.state = {
//             dataSource: [], currentDataSource: [],
//             searchText: '',
//             searchedColumn: '',
//             columns: [],
//             selectedRowKeys: [],
//             myProps: {},
//         };

//     }
//     componentDidMount() {
//         const columns = this.getColumns(this.props.columns);
//         const myProps = (({ columns, dataSource, isHaveCheckbox, myScroll, ...o }) => o)(this.props);
//         myProps.pagination = this.props.pagination !== undefined ? this.props.pagination : false;
//         myProps.size = this.props.size !== undefined ? this.props.size : "small";
//         myProps.onChange = this.onTableChange;
//         myProps.bordered = this.props.bordered !== undefined ? this.props.bordered : true;

//         if (myProps.isStriped !== false) {
//             myProps.className = CommonUtil.getApppendClassName(myProps.className, "table-striped");
//         }
//         if (myProps.style === undefined) {
//             myProps.style = {};
//         }
//         if (this.props.myScroll === undefined || this.props.myScroll.isUseScollDefault !== false) {
//             // if (myProps.style.maxHeight === undefined) {
//             //     myProps.style.maxHeight = "700px";
//             // }
//             // if (myProps.style.minHeight === undefined) {
//             //     myProps.style.minHeight = "700px";
//             // }
//             myProps.style.overflow = "auto";
//         }
//         this.setState({ columns, myProps });
//         this.updateDataSource(this.props.dataSource);
//     }
//     componentDidUpdate(prevProps, prevState, snapshot) {
//         if (prevProps.dataSource !== this.props.dataSource) {
//             this.updateDataSource(this.props.dataSource);
//         }
//     }

//     updateDataSource = (data) => {
//         if (data === undefined) {
//             return;
//         }
//         let index = 0;
//         let dataTemp = Object.assign([], data);
//         dataTemp.forEach(element => {
//             element.key = index;
//             index++;
//         });
//         this.setState({ dataSource: dataTemp, currentDataSource: { ...dataTemp } });
//     }

//     getColumnSearchProps = dataIndex => ({
//         filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
//             <div style={{ padding: 8 }}>
//                 <Input
//                     ref={node => {
//                         this.searchInput = node;
//                     }}
//                     placeholder={`Search ${dataIndex}`}
//                     value={selectedKeys[0]}
//                     onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
//                     onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
//                     style={{ marginBottom: 8, display: 'block' }}
//                 />
//                 <Space>
//                     <Button
//                         type="primary"
//                         onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
//                         icon={<SearchOutlined />}
//                         size="small"
//                         style={{ width: 90 }}
//                     >
//                         Search
//                     </Button>
//                     <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
//                         Reset
//                     </Button>
//                     {/* <Button
//                         type="link"
//                         size="small"
//                         onClick={() => {
//                             confirm({ closeDropdown: false });
//                             this.setState({
//                                 searchText: selectedKeys[0],
//                                 searchedColumn: dataIndex,
//                             });
//                         }}
//                     >
//                         Filter
//                     </Button> */}
//                 </Space>
//             </div>
//         ),
//         filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
//         onFilter: (value, record) =>
//             record[dataIndex]
//                 ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
//                 : '',
//         onFilterDropdownVisibleChange: visible => {
//             if (visible) {
//                 setTimeout(() => this.searchInput.select(), 100);
//             }
//         },
//         render: text =>
//             this.state.searchedColumn === dataIndex ? (
//                 <Highlighter
//                     highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
//                     searchWords={[this.state.searchText]}
//                     autoEscape
//                     textToHighlight={text ? text.toString() : ''}
//                 />
//             ) : (
//                 text
//             ),
//     });

//     handleSearch = (selectedKeys, confirm, dataIndex) => {
//         confirm();
//         this.setState({
//             searchText: selectedKeys[0],
//             searchedColumn: dataIndex,
//         });
//     };

//     handleReset = clearFilters => {
//         clearFilters();
//         this.setState({ searchText: '' });
//     };

//     checkAll = () => {
//         let str = "";
//         this.state.currentDataSource.forEach(element => {
//             if (element._isChecked === true) {
//                 str += element.userName + ",";
//             }

//         });
//         alert(str);
//     };

//     checkItem = (record, index) => {
//         //alert(e.target.checked);
//         // this.setState(prevState => ({
//         //     dataSource: {
//         //         ...prevState.dataSource,
//         //         [prevState.dataSource[index]._isChecked]: true,
//         //     },
//         // }));
//         const newItems = [...this.state.currentDataSource];
//         newItems[index]._isChecked = newItems[index]._isChecked !== true;
//         this.setState({ currentDataSource: newItems });
//     };

//     onTableChange = (pagination, filter, sorter, currentTable) => {
//         //this.setState({ currentDataSource: currentTable });
//     };

//     getColumns = (columnProps) => {

//         if (columnProps === undefined) {
//             return [];
//         }
//         let columns = [];

//         columnProps.forEach(element => {
//             let column = CommonUtil.cloneObject(element);

//             column.dataIndex = column.dataIndex === undefined ? element.key : column.dataIndex;
//             if (element.isSort === true) {
//                 column.sorter = (a, b) => {
//                     return CommonUtil.compareAllType(a[element.key], b[element.key]);
//                 }
//             }
//             if (element.isSearch === true) {

//                 let dataIndex = element.key;
//                 column.filterDropdown = ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
//                     <div style={{ padding: 8 }}>
//                         <Input
//                             ref={node => {
//                                 this.searchInput = node;
//                             }}
//                             placeholder={`Search ${dataIndex}`}
//                             value={selectedKeys[0]}
//                             onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
//                             onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
//                             style={{ marginBottom: 8, display: 'block' }}
//                         />
//                         <Space>
//                             <Button
//                                 type="primary"
//                                 onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
//                                 icon={<SearchOutlined />}
//                                 size="small"
//                                 style={{ width: 90 }}
//                             >
//                                 Search
//                             </Button>
//                             <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
//                                 Reset
//                             </Button>
//                             <Button
//                                 type="link"
//                                 size="small"
//                                 onClick={() => {
//                                     confirm({ closeDropdown: false });
//                                     this.setState({
//                                         searchText: selectedKeys[0],
//                                         searchedColumn: dataIndex,
//                                     });
//                                 }}
//                             >
//                                 Filter
//                             </Button>
//                         </Space>
//                     </div>
//                 );
//                 column.filterIcon = filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />;
//                 //Xử lý khi thực hiện search các cột dữ liệu
//                 column.onFilter = (value, record) => {
//                     if (typeof record[dataIndex] === 'boolean') {
//                         return record[dataIndex].toString() === value;
//                     }
//                     else {
//                         return record[dataIndex]
//                             ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
//                             : '';
//                     }
//                 }

//                 column.onFilterDropdownVisibleChange = visible => {
//                     if (visible) {
//                         setTimeout(() => this.searchInput.select(), 100);
//                     }
//                 };
//                 column.render = text =>
//                     this.state.searchedColumn === dataIndex ? (
//                         <Highlighter
//                             highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
//                             searchWords={[this.state.searchText]}
//                             autoEscape
//                             textToHighlight={text ? text.toString() : ''}
//                         />
//                     ) : (
//                         text
//                     );
//             }
//             if (element.render !== undefined) {

//                 column.render = element.render;
//             }
//             columns.push(column);
//         });
//         return columns;
//     }

//     //#region Event for Parent call
//     getSelectedRowKeys = () => {
//         return this.state.selectedRowKeys;
//     }
//     //#endregion

//     render() {
//         const columns = this.state.columns.map((col, index) => ({
//             ...col,
//             // onHeaderCell: (column) => ({
//             //   width: column.width,
//             //   onResize: this.handleResize(index),
//             // }),
//           }));
//         //const columns = this.state.columns;
//         //const { selectedRowKeys } = this.state;
//         const rowSelection = {
//             // selections: [
//             //     Table.SELECTION_ALL,
//             //     Table.SELECTION_INVERT,
//             //     Table.SELECTION_NONE,
//             //     {
//             //         key: 'odd',
//             //         text: 'Select Odd Row',
//             //         onSelect: changableRowKeys => {
//             //             let newSelectedRowKeys = [];
//             //             newSelectedRowKeys = changableRowKeys.filter((key, index) => {
//             //                 if (index % 2 !== 0) {
//             //                     return false;
//             //                 }
//             //                 return true;
//             //             });
//             //             this.setState({ selectedRowKeys: newSelectedRowKeys });
//             //         },
//             //     },
//             //     {
//             //         key: 'even',
//             //         text: 'Select Even Row',
//             //         onSelect: changableRowKeys => {
//             //             let newSelectedRowKeys = [];
//             //             newSelectedRowKeys = changableRowKeys.filter((key, index) => {
//             //                 if (index % 2 !== 0) {
//             //                     return true;
//             //                 }
//             //                 return false;
//             //             });
//             //             this.setState({ selectedRowKeys: newSelectedRowKeys });
//             //         },
//             //     },
//             // ],
//             onSelect: this.props.onSelect,
//             selectedRowKeys: this.props.selectedRowKeys,
//             onChange: this.props.onRowChange,
//             columnWidth: 35,
//             type: this.props.rowType,
//             onSelectAll: this.props.onSelectAll
//         };
//         return (
//             <Fragment>
//                 <Table
//                     columns={columns}
//                     dataSource={this.state.dataSource}
//                     // pagination={false}
//                     // size={'small'}
//                     // className="table-striped tableDefault"
//                     // style={{ overflow: "auto", maxHeight: "700px", minHeight: "700px" }}
//                     // onChange={this.onTableChange}
//                     rowSelection={this.props.isHaveCheckbox === true ? rowSelection : undefined}
//                     // bordered={this.props.bordered === undefined ? true : this.props.bordered}
//                     // rowClassName={(record, index) => record._isChecked === true ? 'ant-table-row-selected' : ''}
//                     // scroll={this.props.scroll === undefined ? { y: 700 } : this.props.scroll}
//                     sticky={this.props.sticky !== undefined ? this.props.sticky : true}
//                     // style={{ minHeight: '748px' }}
//                     {...this.state.myProps}

//                 />
//             </Fragment>
//         );
//     }
// }

// export default MyTable;
