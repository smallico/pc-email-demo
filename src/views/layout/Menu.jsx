const MenuEl = ({ props: { menu, index } }) =>
  menu.children ? (
    <ElSubmenu index={index} key={index}>
      <template slot="title">
        <i class={menu.icon} />
        <span slot="title">{menu.resourceName}</span>
      </template>
      <MenuListEl menuList={menu.children} />
    </ElSubmenu>
  ) : (
    <ElMenuItem index={menu.path} key={index} style={menu.isShowBorder == '1' ? 'border-bottom:1px solid #1B2428': ''}>
      <i class={menu.icon} />
      <span slot="title">{menu.resourceName}</span>
    </ElMenuItem>
  );
const MenuListEl = ({ props: { menuList } }) =>
  menuList.map(menu => <MenuEl menu={menu} index={menu.code}  />);

export default MenuListEl;
