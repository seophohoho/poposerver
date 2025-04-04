import { Ingame } from "../entities/Ingame";
import { ItemSlot } from "../entities/ItemSlot";
import { PartySlot } from "../entities/PartySlot";
import { PokeboxBg } from "../entities/PokeboxBg";
import { AppDataSource } from "../db/data-source";
import { Repository } from "typeorm";
import { ConflictHttpError } from "../share/http-error";
import { verifyAccessToken } from "../share/jwt";
import { IngameAvatar, IngameGender } from "../entities/Ingame";

interface RegisterReq {
  gender: "boy" | "girl";
  avatar: "1" | "2" | "3" | "4";
  nickname: string;
}

export class IngameService {
  private static get repo(): Repository<Ingame> {
    return AppDataSource.getRepository(Ingame);
  }

  private static get itemSlotRepo(): Repository<ItemSlot> {
    return AppDataSource.getRepository(ItemSlot);
  }

  private static get partySlotRepo(): Repository<PartySlot> {
    return AppDataSource.getRepository(PartySlot);
  }

  private static get pokeboxBgRepo(): Repository<PokeboxBg> {
    return AppDataSource.getRepository(PokeboxBg);
  }

  static async register(data: RegisterReq, token: string) {
    const payload = verifyAccessToken(token) as { id: number };
    const accountId = payload.id;

    const exist = await this.repo.findOneBy({
      nickname: data.nickname,
    });

    if (exist) throw new ConflictHttpError("already nickname");

    const ingameAccount = this.repo.create({
      account_id: accountId,
      x: 10,
      y: 10,
      location: "000",
      money: 5000,
      nickname: data.nickname,
      gender: getGenderEnum(data.gender),
      avatar: getAvatarEnum(data.avatar),
    });

    const itemSlot = this.itemSlotRepo.create({
      account_id: accountId,
    });

    const partySlot = this.partySlotRepo.create({
      account_id: accountId,
    });

    const pokeboxBg = this.pokeboxBgRepo.create({
      account_id: accountId,
    });

    await this.repo.save(ingameAccount);
    await this.itemSlotRepo.save(itemSlot);
    await this.partySlotRepo.save(partySlot);
    await this.pokeboxBgRepo.save(pokeboxBg);

    return ingameAccount;
  }

  static async getUserData(user: number) {
    if (!user) {
      throw Error("empty user.");
    }

    const data = await this.repo
      .createQueryBuilder("ingame")
      .leftJoinAndSelect("ingame.itemSlot", "itemSlot")
      .leftJoinAndSelect("ingame.partySlot", "partySlot")
      .leftJoinAndSelect("ingame.pokeboxBg", "pokeboxBg")
      .where("ingame.account_id = :user", { user })
      .getOne();

    if (!data) return null;

    return data;
  }
}

const getAvatarEnum = (value: string): IngameAvatar => {
  const found = Object.values(IngameAvatar).find((v) => v === value);
  if (!found) throw new Error("Invalid avatar value");
  return found as IngameAvatar;
};

const getGenderEnum = (value: string): IngameGender => {
  const found = Object.values(IngameGender).find((v) => v === value);
  if (!found) throw new Error("Invalid gender value");
  return found as IngameGender;
};
