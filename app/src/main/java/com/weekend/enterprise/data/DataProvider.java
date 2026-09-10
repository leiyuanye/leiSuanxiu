package com.weekend.enterprise.data;

import com.weekend.enterprise.model.Company;
import com.weekend.enterprise.model.Product;
import com.weekend.enterprise.model.TimelineEvent;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class DataProvider {

    private static List<Company> companies;

    public static List<Company> getCompanies() {
        if (companies == null) {
            companies = new ArrayList<>();
            companies.add(createTencent());
            companies.add(createAlibaba());
            companies.add(createBaidu());
            companies.add(createNetEase());
            companies.add(createMeituan());
            companies.add(createJD());
        }
        return companies;
    }

    public static Company getCompanyById(int id) {
        for (Company c : getCompanies()) {
            if (c.getId() == id) return c;
        }
        return null;
    }

    private static Company createTencent() {
        List<TimelineEvent> timeline = Arrays.asList(
            new TimelineEvent("1998", "腾讯成立", "马化腾等五位创始人在深圳创立腾讯计算机系统有限公司"),
            new TimelineEvent("1999", "OICQ发布", "推出即时通讯软件OICQ（后更名为QQ），开启社交时代"),
            new TimelineEvent("2004", "港股上市", "腾讯控股有限公司在香港联合交易所主板上市"),
            new TimelineEvent("2011", "微信诞生", "推出移动社交应用微信，开启移动社交新时代"),
            new TimelineEvent("2017", "市值破万亿", "腾讯市值突破3000亿美元，成为亚洲市值最高公司"),
            new TimelineEvent("2023", "AI布局", "推出混元大模型，全面布局人工智能领域")
        );
        List<Product> products = Arrays.asList(
            new Product("微信", "社交 · 即时通讯", "13亿", "4.8", "2011",
                "微信是腾讯公司推出的即时通讯应用程序，支持跨通信运营商、跨操作系统平台发送文字、图片、语音和视频消息，已成为国民级社交应用。",
                Arrays.asList("即时通讯", "朋友圈", "微信支付", "小程序", "视频号", "公众号"), "#07C160"),
            new Product("QQ", "社交 · 即时通讯", "5.7亿", "4.5", "1999",
                "QQ是腾讯公司开发的一款基于Internet的即时通信软件，支持在线聊天、视频电话、点对点断点续传文件等多种功能。",
                Arrays.asList("在线聊天", "文件传输", "QQ空间", "QQ群", "音视频通话"), "#12B7F5"),
            new Product("腾讯视频", "娱乐 · 在线视频", "4.8亿", "4.6", "2011",
                "腾讯视频是在线视频平台，提供电影、电视剧、综艺、动漫、新闻等丰富的视频内容服务。",
                Arrays.asList("高清视频", "独播内容", "VIP会员", "弹幕互动", "短视频"), "#FF6037"),
            new Product("王者荣耀", "游戏 · MOBA", "1.6亿", "4.7", "2015",
                "王者荣耀是腾讯天美工作室开发的MOBA类手机游戏，是中国最受欢迎的手机游戏之一。",
                Arrays.asList("5v5对战", "排位赛", "英雄皮肤", "社交系统", "电竞赛事"), "#9B59B6")
        );
        return new Company(1, "腾讯科技", "T", "#0099FF",
            "用户为本，科技向善", "互联网", "1998年", "深圳", "10万+人",
            "港股上市", "9:00-18:00", "偶尔加班", "10-20天",
            "腾讯是中国领先的互联网增值服务提供商，为用户提供社交、通信、游戏、数字内容等服务，旗下拥有微信、QQ等国民级产品。",
            Arrays.asList("微信", "QQ", "腾讯视频", "王者荣耀"), timeline, products);
    }

    private static Company createAlibaba() {
        List<TimelineEvent> timeline = Arrays.asList(
            new TimelineEvent("1999", "阿里创立", "马云等18人在杭州创立阿里巴巴，B2B电子商务平台上线"),
            new TimelineEvent("2003", "淘宝上线", "推出C2C电子商务平台淘宝网，颠覆传统零售模式"),
            new TimelineEvent("2004", "支付宝诞生", "推出第三方支付平台支付宝，解决网购信任问题"),
            new TimelineEvent("2014", "美股上市", "阿里巴巴在纽约证券交易所上市，创全球最大IPO纪录"),
            new TimelineEvent("2019", "港股二次上市", "阿里巴巴在香港证券交易所完成二次上市"),
            new TimelineEvent("2023", "通义千问", "推出通义千问大模型，全面拥抱AI时代")
        );
        List<Product> products = Arrays.asList(
            new Product("淘宝", "电商 · C2C", "9亿", "4.7", "2003",
                "淘宝是亚洲最大的网上购物平台，提供服装、数码、家居等各类商品的在线交易服务。",
                Arrays.asList("商品搜索", "直播购物", "淘宝直播", "信用购", "退换货保障"), "#FF6A00"),
            new Product("天猫", "电商 · B2C", "7亿", "4.8", "2008",
                "天猫是阿里巴巴旗下的B2C电商平台，汇聚品牌旗舰店，提供正品保障的购物体验。",
                Arrays.asList("品牌旗舰店", "天猫超市", "天猫国际", "双11狂欢", "正品保障"), "#C40000"),
            new Product("支付宝", "金融 · 支付", "10亿", "4.6", "2004",
                "支付宝是全球领先的第三方支付平台，提供转账、缴费、理财、信用等综合金融服务。",
                Arrays.asList("移动支付", "余额宝", "花呗", "蚂蚁森林", "生活缴费"), "#1677FF"),
            new Product("钉钉", "办公 · 协同", "7亿", "4.3", "2015",
                "钉钉是阿里巴巴推出的企业级智能移动办公平台，助力企业数字化转型。",
                Arrays.asList("即时通讯", "考勤打卡", "在线会议", "文档协作", "审批流程"), "#1EADFF")
        );
        return new Company(2, "阿里巴巴", "A", "#FF6A00",
            "让天下没有难做的生意", "电子商务", "1999年", "杭州", "20万+人",
            "美/港股上市", "9:00-18:00", "偶尔加班", "7-15天",
            "阿里巴巴集团是全球领先的电子商务企业，提供电商、金融、物流、云计算等服务，旗下拥有淘宝、天猫、支付宝等知名平台。",
            Arrays.asList("淘宝", "天猫", "支付宝", "钉钉"), timeline, products);
    }

    private static Company createBaidu() {
        List<TimelineEvent> timeline = Arrays.asList(
            new TimelineEvent("2000", "百度创立", "李彦宏在中关村创立百度，推出中文搜索引擎"),
            new TimelineEvent("2005", "纳斯达克上市", "百度在美国纳斯达克上市，创中国概念股神话"),
            new TimelineEvent("2010", "布局AI", "开始投入人工智能研发，自然语言处理技术领先"),
            new TimelineEvent("2017", "Apollo计划", "发布自动驾驶开放平台Apollo，引领自动驾驶领域"),
            new TimelineEvent("2023", "文心一言", "推出大语言模型文心一言，对标ChatGPT")
        );
        List<Product> products = Arrays.asList(
            new Product("百度搜索", "工具 · 搜索引擎", "6亿", "4.5", "2000",
                "百度搜索是全球最大的中文搜索引擎，提供网页、新闻、图片、视频等全方位搜索服务。",
                Arrays.asList("网页搜索", "图片搜索", "百度知道", "百度百科", "百度学术"), "#2932E1"),
            new Product("百度地图", "出行 · 地图导航", "5亿", "4.6", "2005",
                "百度地图提供智能路线规划、实时导航、路况查询等服务，是出行必备工具。",
                Arrays.asList("智能导航", "实时路况", "公交规划", "AR步行导航", "全景地图"), "#2932E1"),
            new Product("百度网盘", "工具 · 云存储", "8亿", "4.2", "2012",
                "百度网盘提供大容量文件存储、分享、在线预览等功能，是中国领先的个人云存储服务。",
                Arrays.asList("大容量存储", "文件分享", "在线预览", "视频播放", "自动备份"), "#2B8FFF"),
            new Product("文心一言", "AI · 大模型", "2亿", "4.4", "2023",
                "文心一言是百度推出的知识增强大语言模型，具备对话、创作、编程等AI能力。",
                Arrays.asList("智能对话", "内容创作", "代码生成", "图片创作", "知识问答"), "#5B2EE6")
        );
        return new Company(3, "百度", "B", "#2932E1",
            "科技让世界更简单", "搜索引擎", "2000年", "北京", "4万+人",
            "美股上市", "9:00-18:00", "偶尔加班", "7-15天",
            "百度是全球最大的中文搜索引擎，提供搜索、地图、网盘、AI等技术与服务，是中国AI领域的先行者。",
            Arrays.asList("百度搜索", "百度地图", "百度网盘", "文心一言"), timeline, products);
    }

    private static Company createNetEase() {
        List<TimelineEvent> timeline = Arrays.asList(
            new TimelineEvent("1997", "网易创立", "丁磊在广州创立网易公司，提供中文互联网服务"),
            new TimelineEvent("2000", "纳斯达克上市", "网易在美国纳斯达克证券交易所挂牌上市"),
            new TimelineEvent("2001", "网易游戏", "正式进军游戏产业，推出《大话西游》等经典网游"),
            new TimelineEvent("2013", "网易云音乐", "推出网易云音乐，以歌单和社区为特色的音乐平台"),
            new TimelineEvent("2016", "网易严选", "推出网易严选电商品牌，主打品质生活方式"),
            new TimelineEvent("2020", "港股上市", "网易在香港证券交易所二次上市")
        );
        List<Product> products = Arrays.asList(
            new Product("网易云音乐", "娱乐 · 音乐", "2亿", "4.8", "2013",
                "网易云音乐以歌单、评论、个性化推荐为特色，是国内领先的音乐社交平台。",
                Arrays.asList("个性化推荐", "歌单分享", "音乐社区", "播客", "黑胶VIP"), "#CC0000"),
            new Product("梦幻西游", "游戏 · MMORPG", "5000万", "4.7", "2003",
                "梦幻西游是网易自主研发的经典回合制网游，运营至今仍是热门游戏之一。",
                Arrays.asList("回合制战斗", "社交系统", "宠物系统", "经济系统", "定期活动"), "#FF9500"),
            new Product("网易邮箱", "工具 · 邮件", "10亿", "4.3", "1997",
                "网易邮箱是中国最早的免费电子邮件服务提供商，提供安全稳定的邮件服务。",
                Arrays.asList("大容量邮箱", "反垃圾系统", "网盘附件", "邮件加密", "多端同步"), "#CC0000"),
            new Product("网易严选", "电商 · 品质生活", "1亿", "4.5", "2016",
                "网易严选是网易推出的品质电商平台，以ODM模式直连工厂，提供高性价比好物。",
                Arrays.asList("工厂直供", "品质严选", "9.9会员", "全品类覆盖", "无忧退换"), "#CC0000")
        );
        return new Company(4, "网易", "N", "#CC0000",
            "匠心聚热爱", "互联网", "1997年", "杭州", "3万+人",
            "美/港股上市", "9:00-18:00", "较少加班", "12-20天",
            "网易是中国领先的互联网技术公司，提供游戏、音乐、教育、电商等服务，以产品精良著称，被誉为互联网界的「匠人」。",
            Arrays.asList("网易云音乐", "网易游戏", "网易邮箱", "网易严选"), timeline, products);
    }

    private static Company createMeituan() {
        List<TimelineEvent> timeline = Arrays.asList(
            new TimelineEvent("2010", "美团创立", "王兴创立美团网，以团购模式切入本地生活服务"),
            new TimelineEvent("2015", "合并大众点评", "美团与大众点评合并，成为本地生活服务龙头"),
            new TimelineEvent("2016", "美团外卖", "美团外卖业务高速增长，日订单量突破百万"),
            new TimelineEvent("2018", "港股上市", "美团在香港联合交易所主板上市"),
            new TimelineEvent("2020", "美团优选", "推出社区团购业务美团优选，布局下沉市场"),
            new TimelineEvent("2023", "AI布局", "推出美团大模型，助力本地生活智能化升级")
        );
        List<Product> products = Arrays.asList(
            new Product("美团外卖", "生活 · 外卖", "6亿", "4.7", "2016",
                "美团外卖是中国领先的外卖订餐平台，提供餐饮配送、生鲜买菜、跑腿代购等服务。",
                Arrays.asList("餐饮外卖", "生鲜买菜", "跑腿代购", "准时达", "红包优惠"), "#FFC300"),
            new Product("大众点评", "生活 · 消费指南", "5亿", "4.6", "2003",
                "大众点评是中国领先的本地生活信息及交易平台，提供商户评价、优惠、预订等服务。",
                Arrays.asList("真实点评", "商户搜索", "优惠团购", "在线预订", "榜单推荐"), "#FF7400"),
            new Product("美团优选", "电商 · 社区团购", "3亿", "4.3", "2020",
                "美团优选是社区团购平台，提供生鲜、食材、日用品的次日达服务。",
                Arrays.asList("社区团购", "次日自提", "产地直供", "生鲜优选", "低价好物"), "#FFC300"),
            new Product("美团酒店", "出行 · 酒店预订", "4亿", "4.6", "2015",
                "美团酒店提供酒店、民宿、公寓等住宿预订服务，覆盖全国各级城市。",
                Arrays.asList("酒店预订", "民宿短租", "特价房", "即时确认", "住后付"), "#FFC300")
        );
        return new Company(5, "美团", "M", "#FFC300",
            "帮大家吃得更好，生活更好", "互联网", "2010年", "北京", "10万+人",
            "港股上市", "9:00-18:00", "偶尔加班", "7-15天",
            "美团是中国领先的生活服务电子商务平台，提供外卖、到店、酒店旅游、出行等多种本地生活服务。",
            Arrays.asList("美团外卖", "大众点评", "美团优选", "美团酒店"), timeline, products);
    }

    private static Company createJD() {
        List<TimelineEvent> timeline = Arrays.asList(
            new TimelineEvent("1998", "京东创立", "刘强东在中关村创立京东，主营光磁产品代理"),
            new TimelineEvent("2004", "转型电商", "受非典影响转型线上，京东多媒体网正式上线"),
            new TimelineEvent("2007", "自建物流", "开始建设自有物流体系，奠定配送核心竞争力"),
            new TimelineEvent("2014", "纳斯达克上市", "京东在美国纳斯达克证券交易所上市"),
            new TimelineEvent("2020", "港股二次上市", "京东在香港证券交易所完成二次上市"),
            new TimelineEvent("2023", "言犀大模型", "发布言犀大模型，推动零售供应链智能化")
        );
        List<Product> products = Arrays.asList(
            new Product("京东商城", "电商 · B2C", "5.8亿", "4.7", "2004",
                "京东商城是中国领先的自营式B2C电商平台，以正品保障和快速配送著称。",
                Arrays.asList("自营正品", "次日达", "PLUS会员", "家电数码", "京东超市"), "#E1251B"),
            new Product("京东物流", "物流 · 快递", "企业级", "4.8", "2007",
                "京东物流是中国领先的技术驱动供应链解决方案及物流服务商，提供仓配一体化服务。",
                Arrays.asList("仓配一体", "211限时达", "冷链物流", "大件物流", "智能仓储"), "#0E6E3A"),
            new Product("京东健康", "健康 · 医疗", "1.5亿", "4.5", "2019",
                "京东健康是京东集团旗下的医疗健康子集团，提供医药电商、互联网医疗、健康服务。",
                Arrays.asList("在线购药", "互联网医院", "健康检测", "京东大药房", "家庭医生"), "#00A0A0"),
            new Product("京东金融", "金融 · 科技", "3亿", "4.3", "2013",
                "京东金融是京东数科旗下的数字金融服务平台，提供支付、理财、信贷等综合金融服务。",
                Arrays.asList("京东支付", "京东小金库", "白条信用", "基金理财", "保险服务"), "#E1251B")
        );
        return new Company(6, "京东", "J", "#E1251B",
            "多快好省", "电子商务", "1998年", "北京", "50万+人",
            "美/港股上市", "9:00-18:00", "偶尔加班", "7-15天",
            "京东是中国领先的自营式电商企业，以正品保障和物流配送著称，提供电商、物流、科技、健康等服务。",
            Arrays.asList("京东商城", "京东物流", "京东健康", "京东金融"), timeline, products);
    }
}
