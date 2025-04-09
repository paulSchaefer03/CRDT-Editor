import TableCell from '@tiptap/extension-table-cell';

const CustomTableCell = TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      backgroundColor: {
        default: null,
        parseHTML: element => element.getAttribute('data-bgcolor'),
        renderHTML: attributes => {
          return {
            'data-bgcolor': attributes.backgroundColor,
            style: attributes.backgroundColor ? `background-color: ${attributes.backgroundColor}` : '',
          };
        },
      },
    };
  },
});

export default CustomTableCell;
