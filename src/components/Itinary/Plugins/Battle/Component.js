import {Icon} from 'antd';

const battleComponent = (showImage) => (mentionProps) => {

  return (
    <span className={'mention'} style={{ "userSelect": 'none'}}
          onClick={() => {
            showImage(mentionProps.mention);
          }}
    >

         <Icon type={'camera'}/> {mentionProps.mention.name}
        </span>
  )
}

export default battleComponent;

