from bs4 import BeautifulSoup

def extract_names_from_html(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        soup = BeautifulSoup(f, "html.parser")

    # 1️⃣ 提取 Schedule 部分讲者
    schedule_names = set()
    for td in soup.find_all("td"):
        # 筛选包含讲者链接的 <a>
        if td.find("a") and ("http" in td.find("a").get("href", "")):
            name = td.find("a").text.strip()
            if name and len(name) <= 10:  # 排除长文本或异常
                schedule_names.add(name)

    # 2️⃣ 提取 Contributors 部分讲者
    contributor_section = soup.find("h1", string=lambda x: x and "贡献者" in x)
    contributor_names = set()
    if contributor_section:
        for li in contributor_section.find_next("ul").find_all("li"):
            a = li.find("a")
            if a and a.text.strip():
                contributor_names.add(a.text.strip())

    return schedule_names, contributor_names


def compare_contributors(schedule_names, contributor_names):
    # 在贡献者中但不在日程表中的 → 多余
    extra = contributor_names - schedule_names
    # 在日程表中但不在贡献者中的 → 缺失
    missing = schedule_names - contributor_names
    return extra, missing


if __name__ == "__main__":
    html_file = "index.html"
    schedule, contributors = extract_names_from_html(html_file)
    extra, missing = compare_contributors(schedule, contributors)

    print("📋 贡献者中多余的（应注释）:")
    for name in sorted(extra):
        print("  -", name)

    print("\n📋 日程中有但贡献者缺失的（应添加）:")
    for name in sorted(missing):
        print("  +", name)
