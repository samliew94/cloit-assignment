import { Injectable } from '@nestjs/common';
import { SharedEnum } from 'src/common/shared.enum';
import { PrismaService } from 'src/prisma.service/prisma.service';
import { v4 as uuid } from 'uuid';

@Injectable()
export class Menu {
  constructor(private prisma: PrismaService) {}

  async handle(body: any) {
    const action = body.action;

    switch (action) {
      case SharedEnum.get:
        return await this.get(body);
      case SharedEnum.save:
        return await this.save(body);
      case SharedEnum.delete:
        return await this.delete(body);
      default:
        throw new Error(`Action ${action} not found`);
    }
  }

  async get(body: any) {
    const type = body.type;

    switch (type) {
      case SharedEnum.id:
        return await this.getById(body);
      case SharedEnum.all:
        return await this.getByAll();
      default:
        throw new Error(`Invalid type ${type}`);
    }
  }

  async getById(body: any) {
    const id = body.id;

    if (!id) throw new Error(`Invalid id`);
  }

  async getByAll() {
    const menus = await this.prisma.menu.findMany();

    const menuMap = {};
    const rootMenus: any[] = [];

    menus.forEach((menu) => {
      menuMap[menu.id] = { ...menu, children: [], depth: -1 };
    });

    menus.forEach((menu) => {
      const node = menuMap[menu.id];

      if (menu.parentId) {
        if (!menuMap[menu.parentId]) {
          menuMap[menu.parentId] = {
            id: menu.parentId,
            name: '',
            children: [],
            depth: -1,
          };
        }
        const parent = menuMap[menu.parentId];
        parent.children.push(node);
      } else {
        rootMenus.push(node);
      }
    });

    function setDepth(node, depth) {
      node.depth = depth;
      node.children.forEach((child) => {
        setDepth(child, depth + 1);
      });
    }

    rootMenus.forEach((menu) => {
      setDepth(menu, 0);
    });

    return {
      menus: rootMenus,
    };
  }

  async save(body: any) {
    const id = body.id;

    if (!id) {
      return await this.create(body);
    } else {
      return await this.update(body);
    }
  }

  async create(body: any) {
    let parentId = body.parentId || null;
    const name = body.name;

    if (!name) throw new Error('Invalid name');

    const result = await this.prisma.menu.create({
      data: {
        parentId,
        name,
      },
    });

    return { menu: result };
  }

  async update(body: any) {
    const id = body.id;
    const parentId = body.parentId || null;
    const name = body.name;

    const menu = await this.prisma.menu.update({
      data: {
        id,
        parentId,
        name,
      },
      where: {
        id,
      },
    });

    return { menu };
  }

  async delete(body: any) {
    const id = body.id;
    const exists = !!(await this.prisma.menu.findFirst({ where: { id } }));

    if (!exists) {
      return { menu: {} };
    }

    const menu = await this.prisma.menu.delete({
      where: { id },
    });

    return { menu };
  }
}
