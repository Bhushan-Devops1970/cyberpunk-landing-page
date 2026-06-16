import streamlit as st
import streamlit.components.v1 as components

# Read your files
with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

with open("styles.css", "r", encoding="utf-8") as f:
    css = f.read()

with open("script.js", "r", encoding="utf-8") as f:
    js = f.read()

# Combine them
page = f"""
<style>
{css}
</style>

{html}

<script>
{js}
</script>
"""

st.set_page_config(layout="wide")
components.html(page, height=1200, scrolling=True)