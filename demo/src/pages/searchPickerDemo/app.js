import { h, Component } from 'preact'
import { ColumnView, RowView } from '@ruiyun/preact-layout-suite'
import Text from '@ruiyun/preact-text'
import Line from '@ruiyun/preact-line'
import Ajax from '@ruiyun/ajax'
import { WithSearchPicker } from '@ruiyun/preact-m-search-picker'
import className from './app.css'

@WithSearchPicker
export default class SearchPicker extends Component {
  state = {
    name: '打开search-picker'
  }
  onChose = item => {
    console.log(item)
    this.props.$searchPicker.hide()
  }
  openSearchPicker = () => {
    this.props.$searchPicker.show({
      searchbar: {
        textSize: 24
      },
      autolist: {
        fetchListData: this.fetchListData,
        keyExtractor: this.keyExtractor,
        format: this.format,
        renderItem: this.renderItem,
        pageSize: 20,
        alias: { pageNum: 'page', pageSize: 'page_size' },
        itemClickHandler: this.onChose,
        params: {
          type: 'hospital'
        }
      },
      slot: updateParams => (
        // eslint-disable-next-line
        <Text onClick={updateParams.bind(this, { type: 'wj' })}>slot</Text>
      )
    })
  }
  fetchListData = async params => {
    const ret = await Ajax.get(
      'https://uapi.dev.quancheng-ec.com/rhea/hospitals',
      {
        params,
        headers: {
          loading: 'false'
        }
      }
    )
    if (ret && ret.success) {
      return ret.result
    }
    return {
      data: [],
      pageInfo: {
        currentPage: params.pageNum
      }
    }
  }
  keyExtractor = item => item.hospitalId
  format = ret => {
    let res = {
      list: ret.data,
      pageInfo: {
        totalPage: Math.ceil(ret.pageInfo.total / ret.pageInfo.pageSize),
        currentPage: ret.pageInfo.currentPage
      }
    }
    return res
  }
  renderItem = item => (
    <div className={className.item}>
      <ColumnView padding={[0, 30, 0, 30]} bgColor='#fff'>
        <RowView height={88}>
          <Text color='#535353' size={28}>
            {item.name}
          </Text>
        </RowView>
        <Line />
      </ColumnView>
    </div>
  )
  render () {
    return (
      <div>
        SearchPicker
        <div className={className.test} onClick={this.openSearchPicker}>
          {this.state.name}
        </div>
      </div>
    )
  }
}
