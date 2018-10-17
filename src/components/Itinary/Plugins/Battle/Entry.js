import {Popover, Icon, Tag} from 'antd';

const battleEntry = (props) => {
  const {
    mention,
    theme,
    isFocused, // eslint-disable-line no-unused-vars
    searchValue, // eslint-disable-line no-unused-vars
    ...parentProps
  } = props;

  console.log(mention);

  return (
    <div {...parentProps}>
      <span> <img src={mention.url}/>  <strong> {mention.name} </strong> </span>
    </div>
  );
};

export default battleEntry;
