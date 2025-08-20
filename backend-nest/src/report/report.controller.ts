import { Controller, Get } from '@nestjs/common';

@Controller('report')
export class ReportController {
  @Get()
  getReport() {
    // Example mock data
    const rmMap: Record<string, { code: string; name: string }> = {
      "1": { code: "RM001", name: "Raw Material 1" },
      "2": { code: "RM002", name: "Raw Material 2" },
    };

    const fgMap: Record<string, { code: string; name: string }> = {
      "10": { code: "FG001", name: "Finished Good 1" },
      "20": { code: "FG002", name: "Finished Good 2" },
    };

    const ids = ["1", "2", "10", "20"];

    const result = ids.map((id) => {
      const rm = rmMap[id];
      const fg = fgMap[id];

      return {
        rmId: id,
        rmCode: rm ? rm.code : null,
        rmName: rm ? rm.name : null,
        fgCode: fg ? fg.code : null,
        fgName: fg ? fg.name : null,
      };
    });

    return result;
  }
}
