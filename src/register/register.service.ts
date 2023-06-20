import { Injectable } from '@nestjs/common';
import { CreateRegisterDto } from './dto/create-register.dto';
import { UpdateRegisterDto } from './dto/update-register.dto';
import {Repository} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Register } from './entities/register.entity';

@Injectable()
export class RegisterService {
  constructor(
    @InjectRepository(Register)
    private registerRepository: Repository<Register>,
  ) {}
//insert
  async insert(createRegisterDto: any) {
    return await this.registerRepository.save(createRegisterDto); 
  }
//check email
  async checkmail(email: string) {
    return await this.registerRepository.findOne({where: {email: email},select: ['email','isVerified','password','count','time',"updatedAt"]});
  }
//verify
  async updateverify(updateRegisterDto:any, isVerified: boolean) {
    return await this.registerRepository.update({email:updateRegisterDto['email']},{isVerified: isVerified});
  }
//update password
  async updatepassword(updateRegisterDto:any, password: any) {
    return await this.registerRepository.update({email:updateRegisterDto},{password: password});
  }
//throttling
  async updatecount(email:any, count: any) {
    return await this.registerRepository.update({email},{count});
  }


  findAll() {
    return `This action returns all register`;
  }

  findOne(id: number) {
    return `This action returns a #${id} register`;
  }

  update(id: number, updateRegisterDto: UpdateRegisterDto) {
    return `This action updates a #${id} register`;
  }

  remove(id: number) {
    return `This action removes a #${id} register`;
  }
}
