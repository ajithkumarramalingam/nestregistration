import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, Put, HttpStatus} from '@nestjs/common';
import { RegisterService } from './register.service';
import { UpdateRegisterDto } from './dto/update-register.dto';
import { Request,Response } from 'express';
import { MailerService } from './mail.service';
import * as jwt from 'jsonwebtoken';
import {hash,compare} from 'bcryptjs';
import * as moment from 'moment';

@Controller('register')
export class RegisterController {
   secret='secretkey'
  constructor(private readonly registerService: RegisterService, private mailer:MailerService) {}

//insert  
@Post('insert')
async create(@Req() req: Request, @Res() res: Response, @Body() createRegisterDto: any) {
  console.log(createRegisterDto,'createRegisterDto');
  
  const checkEmail = await this.registerService.checkmail(createRegisterDto.email);

  try {     
    if (checkEmail && checkEmail.isVerified == false) {
       console.log("old user");
        console.log(checkEmail, 'checkEmail');
        const token = jwt.sign({ email: createRegisterDto.email }, 'secretkey');
        console.log(token, 'token');
        await this.mailer.sendMail({ email: createRegisterDto.email }, token);
        res.status(HttpStatus.OK).json({
          message: 'Email already exists'
        })
      } 
      
      else {
        console.log("new user");
        const token = jwt.sign({ email: createRegisterDto.email }, 'secretkey');
        console.log(token, 'token');
         
        const hashedPassword = await hash(createRegisterDto.password, 10);
        createRegisterDto.password = hashedPassword;
        createRegisterDto.token = token;

        await this.registerService.insert(createRegisterDto);
        await this.mailer.sendMail({ email: createRegisterDto.email }, token);
         res.status(HttpStatus.OK).json({
          message: 'Registration successful'
        })
      }
    } 
     catch (err) {
      console.log(err,'err');
      res.status(HttpStatus.OK).json({
      message: 'Registration failed'
    })
  }
}

//isVerified
  @Put('verify')
  async verify(@Req() req: Request, @Res() res: Response, @Body() createRegisterDto: any) {

    try {      
      const vtoken = jwt.verify(createRegisterDto.token,'secretkey');
      console.log(vtoken,'vtoken');

      if(vtoken) { 
        await this.registerService.updateverify(vtoken,true);
        return res.status(HttpStatus.OK).json({
          message: 'Email verified successfully'
        });
      }
      else{
        return res.status(HttpStatus.OK).json({
          message: 'Email verification failed'
        });
      }
    }
    catch (err) {
      console.log(err,'err');
    }
  }

//login
  @Post('login')
  async login(@Req() req: Request, @Res() res: Response, @Body() createRegisterDto: any) {

    try {
      console.log(createRegisterDto,'createRegisterDto');
      const checkEmail = await this.registerService.checkmail(createRegisterDto.email);
      
      let logincount = checkEmail.count;
      console.log(checkEmail.password,'checkEmail');

      if (checkEmail.count < 3) {
      if (checkEmail && checkEmail.isVerified == true) {
          console.log("helllllooooo");
          
        if(await compare(createRegisterDto.password, checkEmail.password)){
          console.log("passwordssssss");
          
          await this.registerService.updatecount(createRegisterDto.email,logincount=0);
          res.status(HttpStatus.OK).json({
            message: 'Login successful' 
          })
          return;
        }
        else{

           logincount = logincount + 1;
            console.log(logincount,'logincount');
          //  const currenttime : any = this.mailer.getCurrentTime();
          //  console.log(currenttime,'currenttime');
           
            await this.registerService.updatecount(createRegisterDto.email,logincount);
            res.status(HttpStatus.OK).json({
            message: 'invalid password'
          })
        }
      }
      else{
        res.status(HttpStatus.OK).json({
          message: 'Email not verified'
        })
      }
    }
    else{
     console.log('------------------------------------');
    const checkEmail = await this.registerService.checkmail(createRegisterDto.email);
    console.log('checkEmailupdatedAt',moment(checkEmail.updatedAt, "YYYY-MM-DD HH:mm:ss"));
    const blockTime = moment(checkEmail.updatedAt, "YYYY-MM-DD HH:mm:ss"); 
    console.log(blockTime,'blockTime');
    const unBlockTime= blockTime.add(2, "minutes");
    console.log(unBlockTime,'unBlockTime');
    
    let remainingSeconds = moment(unBlockTime).diff(moment(), "seconds");  
    let remainingSecond = Math.max(remainingSeconds, 0); //reamining time
    console.log(remainingSecond,'remainingSecond');
    if(remainingSecond <= 0 ){
      if (checkEmail && checkEmail.isVerified == true) {
        console.log("helllllooooo");
        
      if(await compare(createRegisterDto.password, checkEmail.password)){
        console.log("passwordssssss");

        res.status(HttpStatus.OK).json({
          message: 'Login successful' 
        })
      }
      else{
         logincount = logincount + 1;
         const currenttime:any  = this.mailer.getCurrentTime();
         console.log(currenttime,'currenttime');
         
          await this.registerService.updatecount(createRegisterDto.email,logincount);
          res.status(HttpStatus.OK).json({
          message: 'invalid password'
        })
      }
    }
    else{
      res.status(HttpStatus.OK).json({
        message: 'Email not verified'
      })
    }

    }else{
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'your account is blocked'
      })
    }
  }
  }
    catch (err) {
      res.status(HttpStatus.OK).json({
        message: 'Login failed'
      })
    }
  }

//forgot password
  @Post('forgot')
  async forgot(@Req() req: Request, @Res() res: Response, @Body() createRegisterDto: any) {
    try {
      const checkEmail = await this.registerService.checkmail(createRegisterDto.email);
      if (checkEmail && checkEmail.isVerified == true) {
        console.log(checkEmail, 'checkEmail');
        const token = jwt.sign({ email: createRegisterDto.email }, 'secretkey');
        console.log(token, 'token');
        await this.mailer.sendMailToPassword({ email: createRegisterDto.email }, token);
        res.status(HttpStatus.OK).json({
          message: 'Email sent successfully'
        })
      }
      else {
        res.status(HttpStatus.OK).json({
          message: 'Email sending failed'
        })
      }
    }
    catch (err) {
      res.status(HttpStatus.OK).json({
        message: 'Email sending failed'
      })
    }
  }

//reset password
  @Put('reset')
  async reset(@Req() req: Request, @Res() res: Response, @Body() createRegisterDto: any) {
    try {
      console.log(createRegisterDto,'createRegisterDto');
      
      const checkEmail = await this.registerService.checkmail(createRegisterDto.email);
      console.log(checkEmail.email,'checkEmail');
      
      if (checkEmail) {
        const hashedPassword = await hash(createRegisterDto.password, 10);
        console.log(hashedPassword,'hashedPassword');
        
        // createRegisterDto.password = hashedPassword;
        await this.registerService.updatepassword(checkEmail.email,hashedPassword);
        res.status(HttpStatus.OK).json({
          message: 'Password reset successfully'
        })
      }
      else {
        res.status(HttpStatus.OK).json({
          message: 'Password reset failed'
        })
      }
    }
    catch (err) {
      res.status(HttpStatus.OK).json({
        message: 'Password reset failed'
      })
    }}



        

  @Get()
  findAll() {
    return this.registerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.registerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRegisterDto: UpdateRegisterDto) {
    return this.registerService.update(+id, updateRegisterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.registerService.remove(+id);
  }
}

function sendMail(email: string) {
  throw new Error('Function not implemented.');
}

