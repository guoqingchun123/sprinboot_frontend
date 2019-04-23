<template>
  <div>
    <!--<bv-button type="primary" class="el-icon-download" @click="downloadImg">生成图片</bv-button>-->
    <div id="mountNode" />
  </div>
</template>

<script>
  import router from '@/router'
  import G6 from '@antv/g6'

  export default {
    name: 'DashboardAdmin',
    data() {
      return {
        graph: {}
      }
    },
    mounted() {
      const data = {
        nodes: [
          {
            label: '用户相关',
            x: 60,
            y: 60
          }, {
            id: 'userCenter',
            label: '用户中心',
            x: 200,
            y: 60
          }, {
              label: '系统管理',
              x: 60,
              y: 150,
              shape: 'rect'
          }, {
              id: 'users',
              label: '用户管理',
              //跳转router
              router: '/authority/users',
              x: 200,
              y: 150,
              style: {
                cursor: 'pointer'
              }
          }, {
              id: 'roles',
              label: '角色维护',
              router: '/authority/roles',
              x: 350,
              y: 150,
              style: {
                cursor: 'pointer'
              }
          }, {
              id: 'dicts',
              label: '字典管理',
              router: '/authority/dicts',
              x: 500,
              y: 150,
              style: {
                cursor: 'pointer'
              }
          },{
              label: '员工管理',
              x: 60,
              y: 240
          },{
            id: 'EmployeeDaily',
            label: '员工日报',
            shape: 'diamond',
            x: 200,
            y: 240,
            color: '#096dd9',
            style: {
              fill: '#ffff00'
            },
            children: [
              {
                id: 'EditEmpSchedule',
                label: '我的行事历',
                router: '/employManage/employDaily/editEmpSchedule'
              },
              {
                id: 'AuditEmpSchedule',
                label: '行事历审核'
              },
              {
                id: 'CancelSchedule',
                label: '撤销审核行事历',
                children: [
                  {
                    id: 'ListEmpAttend',
                    label: '考勤记录',
                    router: '/employManage/empAttend/listEmpAttend'
                  },
                  {
                    id: 'EmpQueryEmpAttend',
                    label: '我的考勤信息',
                    router: '/employManage/empAttend/empQueryEmpAttend'
                  }
                ]
              }
            ]
          }
        ],
        edges: [
          {
            source: 'users',
            target: 'roles'
          }, {
            source: 'roles',
            target: 'dicts'
          }
        ]
      }
      //自定义菱形
      G6.registerNode('diamond', {
        draw(cfg, group) {
          const size = cfg.size || [40, 40]; // 如果没有 size 时的默认大小
          const width = size[0];
          const height = size[1];
          const shape = group.addShape('path', {
            attrs: {
              //  / 1 \
              // 4     2
              //  \ 3 /
              path: [
                ['M', 0, height / 2], // 上部顶点
                ['L', width / 2, 0], // 右侧点
                ['L', 0, - height / 2], // 下部
                ['L', - width / 2, 0], // 左侧
                ['Z'] // 封闭
              ],
              stroke: cfg.color, // 颜色应用到边上，如果应用到填充，则使用 fill: cfg.color
              fill: cfg.style.fill
            }
          });
          if(cfg.label) { // 如果有文本
            // 如果需要复杂的文本配置项，可以通过 labeCfg 传入
            // const style = (cfg.labelCfg && cfg.labelCfg.style) || {};
            // style.text = cfg.label;
            group.addShape('text', {
              // attrs: style
              attrs: {
                x: 0, // 居中
                y: 0,
                textAlign: 'center',
                textBaseline: 'middle',
                text: cfg.label,
                fill: '#666'
              }
            });
          }
          return shape;
        }
      });

      //声明Graph
      this.graph = new G6.Graph({
        container: 'mountNode',
        width: 800,
        height: 500,
        modes: { // 支持的 behavior
          default: ['click-select'/*,'drag-node','zoom-canvas','drag-canvas','activate-relations',{
            //节点tooltip
            type: 'tooltip',
            formatText(model) {
              return model.label;
            }
          },{
            //连线tooltip
            type: 'edge-tooltip',
            formatText(model) {
              return model.source+"->"+model.target
            }
          }*/]
        },
        // 默认节点配置
        defaultNode: {
          shape: 'rect',
          size: [100, 50]
        },
        nodeStyle: {
          // 节点在默认状态下的样式
          default: {
            fill: '#40a9ff',
            stroke: '#096dd9'
          },
          // 当节点在 selected 状态下的样式
          selected: {
            lineWidth: 2,
            fillOpacity: 0.8
          }
        },
        // 默认边配置
        defaultEdge: {
          shape: 'cubic-horizontal',
          size: 1
        },
        edgeStyle: {
          // 默认边的样式
          default: {
            stroke: '#A3B1BF'
          }
        }
      })

      //添加数据源
      this.graph.data(data)
      //渲染视图
      this.graph.render()
      //遍历添加节点
      this.addNodes(data.nodes, this.graph, true)
      /*const node1 = graph.findById('users')
      console.log(node1)
      if (node1.isVisible()){
        graph.hideItem(node1)
      }*/
      this.graph.on('node:click', ev => {
        if (ev.item._cfg.model.router) {
          router.push(ev.item._cfg.model.router)
        }
        // TODO: 试一下能不能自定义属性，直接把route定义到node上
        /*if (ev.item._cfg.id) {
          if (ev.item._cfg.id === 'users') {
            router.push('/authority/users')
          }
        }*/
      })
    },
    methods: {
      addNodes(data, graph, headNode) {
        data.forEach((node, i)=>{
          const x = node.x
          const y = node.y
          const size = node.size ? node.size : [100,50]
          if (headNode.hasChild) {
            node.x = headNode.nodeX + 140
            node.y = headNode.nodeY + i * size[1] + i * size[1] / data.length
            graph.addItem('node', node)
            if (node.id && headNode.head.id) {
              graph.addItem('edge', {
                source: node.id,
                target: headNode.head.id
              })
            }
          }
          //graph.addItem('node', node)
          if (node.children) {
            node.children.forEach((value, i)=> {
              const childNode = value
              if (!(childNode.x && childNode.y)) {
                childNode.x = x + 140
                childNode.y = y + i * size[1] + i * size[1] / node.children.length
              }
              if (!childNode.shape) {
                childNode.shape = 'ellipse'
              }
              if (!childNode.size) {
                childNode.size = [100,50]
              }
              childNode.size = [size[0],size[1]]
              //子节点的形状
              if (node.shape) {
                if (node.shape == 'ellipse') {
                  childNode.shape = 'diamond'
                }else {
                  childNode.shape = 'ellipse'
                }
              } else {
                childNode.shape = 'diamond'
              }
              //添加节点
              graph.addItem('node', childNode)
              //递归childs(先添加父节点，防止添加父子节点连接线出错)
              if (value.children) {
                const headNode = {
                  hasChild: true,
                  nodeX: childNode.x,
                  nodeY: childNode.y,
                  head: value
                }
                this.addNodes(value.children, graph, headNode)
              }
              //添加节点连接线
              if (node.id && childNode.id) {
                graph.addItem('edge', {
                  source: node.id,
                  target: childNode.id
                })
              }
            })
          }
        })
      },
      downloadImg() {
        this.graph.downloadImage('OA')
      }
    }
  }
</script>
<style>
  .g6-tooltip {
    padding: 10px 6px;
    color: #444;
    background-color: rgba(255,255,255,0.9);
    border: 1px solid #e2e2e2;
    border-radius: 4px;
  }
</style>

