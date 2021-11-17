import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '../config/config.service';
import { RabbitMqService } from '../rabbit-mq/rabbit-mq.service';
import { RabbitMqModule } from '../rabbit-mq/rabbit-mq.module';
import { DataImportService } from './data-import.service';
import * as fs from 'fs';
import { HttpException } from '@nestjs/common';
jest.mock('../rabbit-mq/rabbit-mq.service');

describe('DataImportService', () => {
  let service: DataImportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RabbitMqModule],
      providers: [DataImportService, ConfigService, RabbitMqService],
    }).compile();

    service = module.get<DataImportService>(DataImportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  // Test with excel file
  it('Read excel file success (no row error)', async () => {
    const returnData = {
      numberRecords: 2,
      validRecords: 2
    };
    const buffer = fs.readFileSync(__dirname+'/../../testcases/case1.xlsx');
    const resultFinal = await service.uploadData(buffer);
    expect(resultFinal.result).toEqual(returnData);
  });

  it('Read excel file: one row data is error', async () => {
    const returnData = {
      numberRecords: 3,
      validRecords: 2
    };
    const buffer = fs.readFileSync(__dirname+'/../../testcases/case2.xlsx');
    const resultFinal = await service.uploadData(buffer);
    expect(resultFinal.result.validRecords).toEqual(returnData.validRecords);
    expect(resultFinal.result.numberRecords - resultFinal.result.validRecords).toBeGreaterThan(0);
  });

  it('Read excel file: all row data is error', async () => {
    const returnData = {
      numberRecords: 3,
      validRecords: 0
    };
    const buffer = fs.readFileSync(__dirname+'/../../testcases/case3.xlsx')
    const resultFinal = await service.uploadData(buffer);
    expect(resultFinal.result.validRecords).toEqual(returnData.validRecords);
    expect(resultFinal.result.numberRecords).toEqual(returnData.numberRecords);
  });

  it('Read excel file: empty data', async () => {
      const buffer = fs.readFileSync(__dirname+'/../../testcases/case4.xlsx');
      expect(async () => await service.uploadData(buffer)).rejects.toThrowError(HttpException);
  });

  it('Read excel file: no header || no data', async () => {
      const buffer = fs.readFileSync(__dirname+'/../../testcases/case5.xlsx');
      expect(async () => await service.uploadData(buffer)).rejects.toThrowError(HttpException);
  });

  // Test with csv file
  it('Read csv file success (no row error)', async () => {
    const returnData = {
      numberRecords: 2,
      validRecords: 2
    };
    const buffer = fs.readFileSync(__dirname+'/../../testcases/case1.csv');
    const resultFinal = await service.uploadData(buffer);
    expect(resultFinal.result).toEqual(returnData);
  });

  it('Read excel file: one row data is error', async () => {
    const returnData = {
      numberRecords: 3,
      validRecords: 2
    };
    const buffer = fs.readFileSync(__dirname+'/../../testcases/case2.csv');
    const resultFinal = await service.uploadData(buffer);
    expect(resultFinal.result.validRecords).toEqual(returnData.validRecords);
    expect(resultFinal.result.numberRecords - resultFinal.result.validRecords).toBeGreaterThan(0);
  });

  it('Read excel file: all row data is error', async () => {
    const returnData = {
      numberRecords: 3,
      validRecords: 0
    };
    const buffer = fs.readFileSync(__dirname+'/../../testcases/case3.csv')
    const resultFinal = await service.uploadData(buffer);
    expect(resultFinal.result.validRecords).toEqual(returnData.validRecords);
    expect(resultFinal.result.numberRecords).toEqual(returnData.numberRecords);
  });

  it('Read excel file: empty data', async () => {
      const buffer = fs.readFileSync(__dirname+'/../../testcases/case4.csv');
      expect(async () => await service.uploadData(buffer)).rejects.toThrowError(HttpException);
  });

  it('Read csv file: no header || no data', async () => {
      const buffer = fs.readFileSync(__dirname+'/../../testcases/case5.csv');
      expect(async () => service.uploadData(buffer)).rejects.toThrowError(HttpException);
  });
});
