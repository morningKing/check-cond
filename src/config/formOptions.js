// 表单选项配置文件
export const formOptions = {
  // 参数类型选项
  paramTypes: [
    { label: '单板参数', value: 'board_param' },
    { label: '16进制单板参数', value: 'hex_board_param' },
    { label: '10进制单板参数', value: 'dec_board_param' },
    { label: '子架参数', value: 'shelf_param' },
    { label: '固定参数', value: 'fixed_param' }
  ],

  // 设备类型选项
  deviceTypes: [
    { label: '路由器', value: 'router' },
    { label: '交换机', value: 'switch' },
    { label: '防火墙', value: 'firewall' },
    { label: '服务器', value: 'server' },
    { label: '存储设备', value: 'storage' },
    { label: '网络设备', value: 'network' }
  ],

  // 版本识别方式选项
  versionMatchTypes: [
    { label: '弱匹配', value: 'weak' },
    { label: '范围', value: 'range' },
    { label: '全匹配', value: 'exact' }
  ],

  // 版本选项（全匹配时使用）
  versionOptions: [
    { label: 'V1.0', value: 'v1.0' },
    { label: 'V1.1', value: 'v1.1' },
    { label: 'V1.2', value: 'v1.2' },
    { label: 'V2.0', value: 'v2.0' },
    { label: 'V2.1', value: 'v2.1' },
    { label: 'V3.0', value: 'v3.0' }
  ],

  // 单板识别方式选项
  boardMatchTypes: [
    { label: '物理板', value: 'physical' },
    { label: '逻辑板', value: 'logical' },
    { label: '包加载ID', value: 'package_id' },
    { label: '单板大类', value: 'board_category' },
    { label: '单板子类', value: 'board_subcategory' }
  ],

  // 物理板选项
  physicalBoardOptions: [
    { label: '主控板', value: 'main_control' },
    { label: '接口板', value: 'interface' },
    { label: '电源板', value: 'power' },
    { label: '风扇板', value: 'fan' }
  ],

  // 逻辑板选项
  logicalBoardOptions: [
    { label: 'CPU板', value: 'cpu' },
    { label: '内存板', value: 'memory' },
    { label: '存储板', value: 'storage' },
    { label: '网络板', value: 'network' }
  ],

  // 包加载ID选项
  packageIdOptions: [
    { label: 'PKG001', value: 'pkg001' },
    { label: 'PKG002', value: 'pkg002' },
    { label: 'PKG003', value: 'pkg003' },
    { label: 'PKG004', value: 'pkg004' }
  ],

  // 单板大类选项
  boardCategoryOptions: [
    { label: '通信类', value: 'communication' },
    { label: '计算类', value: 'computation' },
    { label: '存储类', value: 'storage' },
    { label: '控制类', value: 'control' }
  ],

  // 单板子类选项
  boardSubcategoryOptions: [
    { label: '以太网板', value: 'ethernet' },
    { label: '光纤板', value: 'fiber' },
    { label: '无线板', value: 'wireless' },
    { label: '串口板', value: 'serial' }
  ]
}

// 根据单板识别方式获取对应的选项
export const getBoardOptionsByType = (type) => {
  switch (type) {
    case 'physical':
      return formOptions.physicalBoardOptions
    case 'logical':
      return formOptions.logicalBoardOptions
    case 'package_id':
      return formOptions.packageIdOptions
    case 'board_category':
      return formOptions.boardCategoryOptions
    case 'board_subcategory':
      return formOptions.boardSubcategoryOptions
    default:
      return []
  }
} 